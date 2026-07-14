const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { checkTableAvailability } = require('../services/availabilityService');
const generateBookingReference = require('../utils/generateBookingReference');
const normalizeBookingInput = require('../utils/normalizeBookingInput');
const { convertCafeTimeToUtc, getCafeTimezone, parseIsoInstant } = require('../utils/timezone');
const findBookingByIdentifier = require('../utils/findBookingByIdentifier');

const BOOKING_STATUSES = ['pending', 'confirmed', 'checked-in', 'playing', 'completed', 'cancelled', 'no-show'];
const BOOKING_SOURCES = ['website', 'walk-in', 'phone', 'admin'];
const ALLOWED_DURATIONS = [30, 60, 90, 120];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['checked-in', 'cancelled', 'no-show'],
  'checked-in': ['playing', 'cancelled'],
  playing: ['completed'],
  completed: [],
  cancelled: [],
  'no-show': [],
};
const SORT_OPTIONS = {
  'start-asc': { startDateTime: 1 },
  'start-desc': { startDateTime: -1 },
  'created-desc': { createdAt: -1 },
  'created-asc': { createdAt: 1 },
};

const sendError = (res, statusCode, code, message) => res.status(statusCode).json({ success: false, code, message });
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getAdminBookings = async (req, res, next) => {
  try {
    const filter = {};
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);

    if (req.query.date) {
      const dateValue = String(req.query.date).trim();
      const timezone = getCafeTimezone();
      const dubaiDate = DateTime.fromFormat(dateValue, 'yyyy-MM-dd', { zone: timezone, setZone: true });

      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue) || !dubaiDate.isValid || dubaiDate.toFormat('yyyy-MM-dd') !== dateValue) {
        return sendError(res, 400, 'INVALID_DATE_FILTER', 'Date must use YYYY-MM-DD format.');
      }

      filter.startDateTime = {
        $gte: dubaiDate.startOf('day').toUTC().toJSDate(),
        $lt: dubaiDate.plus({ days: 1 }).startOf('day').toUTC().toJSDate(),
      };
    }

    if (req.query.tableId) {
      const tableId = String(req.query.tableId).trim();
      if (!mongoose.isValidObjectId(tableId)) {
        return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');
      }
      filter.table = tableId;
    }

    if (req.query.status) {
      const status = String(req.query.status).trim().toLowerCase();
      if (!BOOKING_STATUSES.includes(status)) {
        return sendError(res, 400, 'INVALID_BOOKING_STATUS', 'Invalid booking status.');
      }
      filter.status = status;
    }
    if (req.query.source) {
      const source = String(req.query.source).trim().toLowerCase();
      if (!BOOKING_SOURCES.includes(source)) {
        return sendError(res, 400, 'INVALID_BOOKING_SOURCE', 'Invalid booking source.');
      }
      filter.source = source;
    }

    if (req.query.search && String(req.query.search).trim()) {
      const safeSearch = escapeRegex(String(req.query.search).trim());
      const expression = new RegExp(safeSearch, 'i');
      filter.$or = [
        { bookingReference: expression },
        { customerName: expression },
        { phone: expression },
        { email: expression },
      ];
    }

    const sort = SORT_OPTIONS[req.query.sort] || SORT_OPTIONS['start-asc'];
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .select('-__v')
        .populate('table', 'name code type zone capacity')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: { page, limit, total, pages: total === 0 ? 0 : Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getAdminBookingById = async (req, res, next) => {
  try {
    const booking = await findBookingByIdentifier(req.params.id);
    if (!booking) return sendError(res, 404, 'BOOKING_NOT_FOUND', 'Booking not found.');

    return res.status(200).json({
      success: true,
      data: { booking: booking.toObject({ versionKey: false }) },
    });
  } catch (error) {
    return next(error);
  }
};
const createWalkInBooking = async (req, res, next) => {
  try {
    if (req.body.endDateTime !== undefined) {
      return sendError(res, 400, 'END_TIME_NOT_ALLOWED', 'endDateTime is calculated by the server and must not be supplied.');
    }

    const input = normalizeBookingInput(req.body);
    if (!input.tableId) return sendError(res, 400, 'MISSING_TABLE_ID', 'tableId is required.');
    if (!mongoose.isValidObjectId(input.tableId)) return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');
    if (!input.customerName) return sendError(res, 400, 'MISSING_CUSTOMER_NAME', 'customerName is required.');
    if (typeof input.customerName !== 'string' || input.customerName.length < 2 || input.customerName.length > 100) {
      return sendError(res, 400, 'INVALID_CUSTOMER_NAME', 'customerName must contain between 2 and 100 characters.');
    }
    if (!input.phone) return sendError(res, 400, 'MISSING_PHONE', 'phone is required.');
    if (typeof input.phone !== 'string' || input.phone.length > 30) return sendError(res, 400, 'INVALID_PHONE', 'phone must contain no more than 30 characters.');
    if (input.email && (typeof input.email !== 'string' || !EMAIL_PATTERN.test(input.email))) {
      return sendError(res, 400, 'INVALID_EMAIL', 'email must be a valid email address when provided.');
    }
    if (input.players === undefined || input.players === null || input.players === '') return sendError(res, 400, 'MISSING_PLAYERS', 'players is required.');
    if (!Number.isInteger(input.players) || input.players < 1) return sendError(res, 400, 'INVALID_PLAYERS', 'players must be an integer of at least 1.');
    if (!input.startDateTime) return sendError(res, 400, 'MISSING_START_TIME', 'startDateTime is required.');

    const startUtc = parseIsoInstant(input.startDateTime);
    if (!startUtc.isValid) return sendError(res, 400, 'INVALID_START_TIME', 'startDateTime must be a valid ISO datetime.');
    if (input.durationMinutes === undefined || input.durationMinutes === null || input.durationMinutes === '') return sendError(res, 400, 'MISSING_DURATION', 'durationMinutes is required.');
    if (!ALLOWED_DURATIONS.includes(input.durationMinutes)) return sendError(res, 400, 'INVALID_DURATION', 'durationMinutes must be one of: 30, 60, 90, 120.');
    if (typeof input.specialRequest !== 'string' || input.specialRequest.length > 500) return sendError(res, 400, 'INVALID_SPECIAL_REQUEST', 'specialRequest must contain no more than 500 characters.');

    const table = await Table.findById(input.tableId).lean();
    if (!table) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    if (!table.isActive) return sendError(res, 400, 'TABLE_INACTIVE', 'This table is inactive.');
    if (table.status === 'maintenance') return sendError(res, 400, 'TABLE_MAINTENANCE', 'This table is currently under maintenance.');
    if (table.status === 'unavailable') return sendError(res, 400, 'TABLE_UNAVAILABLE', 'This table is currently unavailable.');
    if (input.players > table.capacity) return sendError(res, 400, 'TABLE_CAPACITY_EXCEEDED', `This table can accommodate a maximum of ${table.capacity} players.`);

    const endUtc = startUtc.plus({ minutes: input.durationMinutes });
    const availability = await checkTableAvailability({
      tableId: input.tableId,
      startDateTime: startUtc.toUTC().toISO(),
      endDateTime: endUtc.toUTC().toISO(),
      durationMinutes: input.durationMinutes,
    });

    if (!availability.available) {
      if (availability.code === 'BOOKING_CONFLICT') return sendError(res, 409, 'BOOKING_CONFLICT', 'This table is no longer available for the selected time.');
      return sendError(res, availability.code === 'TABLE_NOT_FOUND' ? 404 : 400, availability.code, availability.message);
    }

    const booking = await Booking.create({
      bookingReference: generateBookingReference(convertCafeTimeToUtc(startUtc)),
      table: table._id,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email || '',
      players: input.players,
      startDateTime: convertCafeTimeToUtc(startUtc),
      endDateTime: convertCafeTimeToUtc(endUtc),
      durationMinutes: input.durationMinutes,
      specialRequest: input.specialRequest,
      status: 'confirmed',
      source: 'walk-in',
      createdBy: 'admin',
    });

    await booking.populate('table', 'name code type zone capacity');
    const responseBooking = booking.toObject({ versionKey: false });
    return res.status(201).json({ success: true, message: 'Walk-in reservation confirmed successfully.', data: { booking: responseBooking } });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((validationError) => validationError.message).join(' ');
      return sendError(res, 400, 'BOOKING_VALIDATION_ERROR', message);
    }
    return next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {

    const nextStatus = typeof req.body.status === 'string' ? req.body.status.trim().toLowerCase() : '';
    if (!BOOKING_STATUSES.includes(nextStatus)) return sendError(res, 400, 'INVALID_BOOKING_STATUS', 'Invalid booking status.');

    const booking = await findBookingByIdentifier(req.params.id, false);
    if (!booking) return sendError(res, 404, 'BOOKING_NOT_FOUND', 'Booking not found.');

    if (!STATUS_TRANSITIONS[booking.status].includes(nextStatus)) {
      return sendError(res, 409, 'INVALID_STATUS_TRANSITION', `Booking cannot move from ${booking.status} to ${nextStatus}.`);
    }

    booking.status = nextStatus;
    if (nextStatus === 'cancelled') {
      booking.cancelledAt = new Date();
      booking.cancellationReason = '';
    }

    await booking.save();
    await booking.populate('table', 'name code type zone capacity');
    return res.status(200).json({ success: true, message: 'Booking status updated successfully.', data: { booking: booking.toObject({ versionKey: false }) } });
  } catch (error) {
    return next(error);
  }
};

const extendBooking = async (req, res, next) => {
  try {

    const additionalMinutes = Number(req.body.additionalMinutes);
    if (![30, 60, 90, 120].includes(additionalMinutes)) {
      return sendError(res, 400, 'INVALID_EXTENSION_DURATION', 'additionalMinutes must be one of: 30, 60, 90, 120.');
    }

    const booking = await findBookingByIdentifier(req.params.id, false);
    if (!booking) return sendError(res, 404, 'BOOKING_NOT_FOUND', 'Booking not found.');

    if (!['confirmed', 'checked-in', 'playing'].includes(booking.status)) {
      return sendError(res, 409, 'BOOKING_CANNOT_BE_EXTENDED', `A ${booking.status} booking cannot be extended.`);
    }

    const currentEndDateTime = new Date(booking.endDateTime);
    const newEndDateTime = new Date(currentEndDateTime.getTime() + additionalMinutes * 60 * 1000);
    const availability = await checkTableAvailability({
      tableId: booking.table.toString(),
      startDateTime: currentEndDateTime.toISOString(),
      endDateTime: newEndDateTime.toISOString(),
      durationMinutes: additionalMinutes,
      excludeBookingId: booking._id.toString(),
      skipAdvanceChecks: true,
    });

    if (!availability.available) {
      if (availability.code === 'BOOKING_CONFLICT') {
        return sendError(res, 409, 'BOOKING_EXTENSION_CONFLICT', 'The requested extension overlaps another booking.');
      }
      return sendError(res, availability.code === 'TABLE_NOT_FOUND' ? 404 : 400, availability.code, availability.message);
    }

    booking.endDateTime = newEndDateTime;
    booking.durationMinutes += additionalMinutes;
    booking.extensionMinutes = (booking.extensionMinutes || 0) + additionalMinutes;
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking extended successfully.',
      data: {
        bookingReference: booking.bookingReference,
        startDateTime: booking.startDateTime.toISOString(),
        endDateTime: booking.endDateTime.toISOString(),
        durationMinutes: booking.durationMinutes,
        extensionMinutes: booking.extensionMinutes,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {

    const reason = req.body.reason === undefined ? '' : req.body.reason;
    if (typeof reason !== 'string' || reason.trim().length > 300) {
      return sendError(res, 400, 'INVALID_CANCELLATION_REASON', 'Cancellation reason must contain no more than 300 characters.');
    }

    const booking = await findBookingByIdentifier(req.params.id, false);
    if (!booking) return sendError(res, 404, 'BOOKING_NOT_FOUND', 'Booking not found.');

    if (['cancelled', 'completed'].includes(booking.status)) {
      return sendError(res, 409, 'BOOKING_CANNOT_BE_CANCELLED', `A ${booking.status} booking cannot be cancelled.`);
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason.trim();
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      data: {
        bookingReference: booking.bookingReference,
        status: booking.status,
        cancelledAt: booking.cancelledAt.toISOString(),
        cancellationReason: booking.cancellationReason,
      },
    });
  } catch (error) {
    return next(error);
  }
};
const moveBookingToTable = async (req, res, next) => {
  try {
    const booking = await findBookingByIdentifier(req.params.id);
    if (!booking) return sendError(res, 404, 'BOOKING_NOT_FOUND', 'Booking not found.');

    const newTableId = typeof req.body.tableId === 'string' ? req.body.tableId.trim() : '';
    if (!newTableId) return sendError(res, 400, 'NEW_TABLE_REQUIRED', 'A new table ID is required.');
    if (!mongoose.isValidObjectId(newTableId)) return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');

    const newTable = await Table.findById(newTableId).lean();
    if (!newTable) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    if (!newTable.isActive) return sendError(res, 400, 'TABLE_INACTIVE', 'This table is inactive.');
    if (newTable.status === 'maintenance') return sendError(res, 400, 'TABLE_MAINTENANCE', 'This table is currently under maintenance.');
    if (newTable.status === 'unavailable') return sendError(res, 400, 'TABLE_UNAVAILABLE', 'This table is currently unavailable.');
    if (booking.players > newTable.capacity) {
      return sendError(res, 400, 'TABLE_CAPACITY_EXCEEDED', `This table can accommodate a maximum of ${newTable.capacity} players.`);
    }

    const currentTableId = booking.table?._id ? booking.table._id.toString() : booking.table.toString();
    if (currentTableId === newTableId) {
      return res.status(200).json({
        success: true,
        message: 'Booking is already assigned to this table.',
        data: { booking: booking.toObject({ versionKey: false }) },
      });
    }

    if (['completed', 'cancelled', 'no-show'].includes(booking.status)) {
      return sendError(res, 409, 'BOOKING_CANNOT_BE_MOVED', `A ${booking.status} booking cannot be moved.`);
    }

    const availability = await checkTableAvailability({
      tableId: newTableId,
      startDateTime: booking.startDateTime.toISOString(),
      endDateTime: booking.endDateTime.toISOString(),
      durationMinutes: booking.durationMinutes,
      excludeBookingId: booking._id.toString(),
      allowExtendedDuration: true,
      skipAdvanceChecks: true,
    });

    if (!availability.available) {
      if (availability.code === 'BOOKING_CONFLICT') {
        return sendError(res, 409, 'TABLE_REASSIGNMENT_CONFLICT', 'The selected table is not available during this booking time.');
      }
      return sendError(res, availability.code === 'TABLE_NOT_FOUND' ? 404 : 400, availability.code, availability.message);
    }

    booking.table = newTable._id;
    await booking.save();
    await booking.populate('table', 'name code type zone capacity');

    return res.status(200).json({
      success: true,
      message: 'Booking moved to the selected table successfully.',
      data: { booking: booking.toObject({ versionKey: false }) },
    });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  cancelBooking,
  createWalkInBooking,
  extendBooking,
  getAdminBookingById,
  getAdminBookings,
  moveBookingToTable,
  updateBookingStatus,
};
