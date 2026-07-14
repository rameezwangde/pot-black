const mongoose = require('mongoose');
const { IANAZone } = require('luxon');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const {
  buildCafeBusinessWindow,
  convertCafeTimeToUtc,
  getCafeTimezone,
  parseIsoInstant,
  parseIsoToCafeTime,
} = require('../utils/timezone');

const BLOCKING_STATUSES = ['pending', 'confirmed', 'checked-in', 'playing'];
const ALLOWED_DURATIONS = [30, 60, 90, 120];

const invalid = (code, message) => ({ valid: false, code, message });

const validateBookingWindow = ({
  startDateTime,
  endDateTime,
  durationMinutes,
  now = new Date(),
  openingHour = process.env.CAFE_OPENING_HOUR ?? 10,
  closingHour = process.env.CAFE_CLOSING_HOUR ?? 23,
  minimumAdvanceMinutes = process.env.MIN_BOOKING_ADVANCE_MINUTES ?? 15,
  maximumAdvanceDays = process.env.MAX_BOOKING_ADVANCE_DAYS ?? 60,
} = {}) => {
  if (startDateTime === undefined || startDateTime === null || startDateTime === '') {
    return invalid('MISSING_START_TIME', 'A booking start time is required.');
  }

  const startUtc = parseIsoInstant(startDateTime);
  if (!startUtc.isValid) {
    return invalid('INVALID_START_TIME', 'The booking start time must be a valid ISO datetime.');
  }

  if (endDateTime === undefined || endDateTime === null || endDateTime === '') {
    return invalid('MISSING_END_TIME', 'A booking end time is required.');
  }

  const endUtc = parseIsoInstant(endDateTime);
  if (!endUtc.isValid) {
    return invalid('INVALID_END_TIME', 'The booking end time must be a valid ISO datetime.');
  }

  if (durationMinutes === undefined || durationMinutes === null || durationMinutes === '') {
    return invalid('MISSING_DURATION', 'A booking duration is required.');
  }

  const duration = Number(durationMinutes);
  if (!ALLOWED_DURATIONS.includes(duration)) {
    return invalid('INVALID_DURATION', 'Duration must be one of: 30, 60, 90, 120 minutes.');
  }

  if (endUtc.toMillis() <= startUtc.toMillis()) {
    return invalid('INVALID_TIME_RANGE', 'End time must be later than start time.');
  }

  const actualDuration = endUtc.diff(startUtc, 'minutes').minutes;
  if (Math.abs(actualDuration - duration) > Number.EPSILON) {
    return invalid('DURATION_MISMATCH', 'The duration does not match the selected start and end times.');
  }

  const timezone = getCafeTimezone();
  const openHour = Number(openingHour);
  const closeHour = Number(closingHour);
  const validHours = IANAZone.isValidZone(timezone)
    && Number.isInteger(openHour)
    && Number.isInteger(closeHour)
    && openHour >= 0
    && openHour < 24
    && closeHour > 0
    && closeHour < 24
    && openHour < closeHour;

  if (!validHours) {
    return invalid('INVALID_BUSINESS_HOURS', 'The configured business hours or cafe timezone are invalid.');
  }

  const minimumAdvance = Number(minimumAdvanceMinutes);
  if (!Number.isFinite(minimumAdvance) || minimumAdvance < 0) {
    return invalid('INVALID_ADVANCE_CONFIGURATION', 'Minimum booking advance minutes must be zero or greater.');
  }

  const maximumAdvance = Number(maximumAdvanceDays);
  if (!Number.isFinite(maximumAdvance) || maximumAdvance < 0) {
    return invalid('INVALID_ADVANCE_CONFIGURATION', 'Maximum booking advance days must be zero or greater.');
  }

  const startDubai = parseIsoToCafeTime(startDateTime, timezone);
  const endDubai = parseIsoToCafeTime(endDateTime, timezone);

  if (startDubai.toISODate() !== endDubai.toISODate()) {
    return invalid('CROSSES_CALENDAR_DAY', 'Bookings cannot cross into the next Dubai calendar day.');
  }

  const { openingDateTime, closingDateTime } = buildCafeBusinessWindow(startDubai, openHour, closeHour);

  if (startDubai.toMillis() < openingDateTime.toMillis()) {
    return invalid('BEFORE_OPENING_TIME', `Bookings cannot start before ${String(openHour).padStart(2, '0')}:00 in ${timezone}.`);
  }

  if (endDubai.toMillis() > closingDateTime.toMillis()) {
    return invalid('AFTER_CLOSING_TIME', `Bookings must end by ${String(closeHour).padStart(2, '0')}:00 in ${timezone}.`);
  }

  const nowUtc = parseIsoInstant(now);
  if (!nowUtc.isValid) {
    return invalid('INVALID_ADVANCE_CONFIGURATION', 'The current-time configuration is invalid.');
  }

  const nowDubai = nowUtc.setZone(timezone);
  if (startDubai.toMillis() <= nowDubai.toMillis()) {
    return invalid('BOOKING_IN_PAST', 'The booking start time must be in the future.');
  }

  if (startDubai.toMillis() < nowDubai.plus({ minutes: minimumAdvance }).toMillis()) {
    return invalid('INSUFFICIENT_ADVANCE_TIME', `Bookings require at least ${minimumAdvance} minutes of advance notice.`);
  }

  if (startDubai.toMillis() > nowDubai.plus({ days: maximumAdvance }).toMillis()) {
    return invalid('BOOKING_TOO_FAR_AHEAD', `Bookings cannot be made more than ${maximumAdvance} days in advance.`);
  }

  return { valid: true };
};

const findConflictingBooking = async ({ tableId, startDateTime, endDateTime, excludeBookingId }) => {
  const requestedStartUtc = convertCafeTimeToUtc(parseIsoInstant(startDateTime));
  const requestedEndUtc = convertCafeTimeToUtc(parseIsoInstant(endDateTime));
  const query = {
    table: tableId,
    status: { $in: BLOCKING_STATUSES },
    startDateTime: { $lt: requestedEndUtc },
    endDateTime: { $gt: requestedStartUtc },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  return Booking.findOne(query)
    .sort({ startDateTime: 1 })
    .select('bookingReference startDateTime endDateTime status')
    .lean();
};

const checkTableAvailability = async ({
  tableId,
  startDateTime,
  endDateTime,
  durationMinutes,
  excludeBookingId,
  now,
} = {}) => {
  if (!mongoose.isValidObjectId(tableId)) {
    return { available: false, code: 'INVALID_TABLE_ID', message: 'The table ID is invalid.' };
  }

  if (excludeBookingId && !mongoose.isValidObjectId(excludeBookingId)) {
    return { available: false, code: 'INVALID_EXCLUDE_BOOKING_ID', message: 'The excluded booking ID is invalid.' };
  }

  const table = await Table.findById(tableId).lean();
  if (!table) {
    return { available: false, code: 'TABLE_NOT_FOUND', message: 'Table not found.' };
  }

  if (!table.isActive) {
    return { available: false, code: 'TABLE_INACTIVE', message: 'This table is inactive.' };
  }

  if (table.status === 'maintenance') {
    return { available: false, code: 'TABLE_MAINTENANCE', message: 'This table is currently under maintenance.' };
  }

  if (table.status === 'unavailable') {
    return { available: false, code: 'TABLE_UNAVAILABLE', message: 'This table is currently unavailable.' };
  }

  const startUtc = parseIsoInstant(startDateTime);
  const endUtc = parseIsoInstant(endDateTime);
  const inferredDuration = durationMinutes ?? (
    endUtc.toMillis() - startUtc.toMillis()
  ) / 60000;
  const windowValidation = validateBookingWindow({
    startDateTime,
    endDateTime,
    durationMinutes: inferredDuration,
    now,
  });

  if (!windowValidation.valid) {
    return { available: false, ...windowValidation };
  }

  const conflict = await findConflictingBooking({
    tableId,
    startDateTime: startUtc.toUTC().toISO(),
    endDateTime: endUtc.toUTC().toISO(),
    excludeBookingId,
  });

  if (conflict) {
    return {
      available: false,
      code: 'BOOKING_CONFLICT',
      message: 'This table is already booked during the selected time.',
      conflict: {
        bookingId: conflict._id.toString(),
        bookingReference: conflict.bookingReference,
        startDateTime: conflict.startDateTime.toISOString(),
        endDateTime: conflict.endDateTime.toISOString(),
        status: conflict.status,
      },
    };
  }

  return {
    available: true,
    table: {
      id: table._id.toString(),
      name: table.name,
      code: table.code,
      type: table.type,
      zone: table.zone,
      capacity: table.capacity,
    },
  };
};

module.exports = {
  BLOCKING_STATUSES,
  checkTableAvailability,
  findConflictingBooking,
  validateBookingWindow,
};
