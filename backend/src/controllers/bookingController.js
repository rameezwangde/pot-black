const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { checkTableAvailability } = require('../services/availabilityService');
const generateBookingReference = require('../utils/generateBookingReference');
const normalizeBookingInput = require('../utils/normalizeBookingInput');
const { convertCafeTimeToUtc, parseIsoInstant } = require('../utils/timezone');

const ALLOWED_DURATIONS = [30, 60, 90, 120];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requestError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendError = (res, statusCode, code, message) => res.status(statusCode).json({
  success: false,
  code,
  message,
});

const createBooking = async (req, res) => {
  try {
    if (req.body.endDateTime !== undefined) {
      return sendError(res, 400, 'END_TIME_NOT_ALLOWED', 'endDateTime is calculated by the server and must not be supplied.');
    }

    const input = normalizeBookingInput(req.body);

    if (!input.tableId) return sendError(res, 400, 'MISSING_TABLE_ID', 'tableId is required.');
    if (!mongoose.isValidObjectId(input.tableId)) return sendError(res, 400, 'INVALID_TABLE_ID', 'tableId must be a valid MongoDB ObjectId.');

    if (!input.customerName) return sendError(res, 400, 'MISSING_CUSTOMER_NAME', 'customerName is required.');
    if (typeof input.customerName !== 'string' || input.customerName.length < 2 || input.customerName.length > 100) {
      return sendError(res, 400, 'INVALID_CUSTOMER_NAME', 'customerName must contain between 2 and 100 characters.');
    }

    if (!input.phone) return sendError(res, 400, 'MISSING_PHONE', 'phone is required.');
    if (typeof input.phone !== 'string' || input.phone.length > 30) {
      return sendError(res, 400, 'INVALID_PHONE', 'phone must contain no more than 30 characters.');
    }

    if (!input.email) return sendError(res, 400, 'MISSING_EMAIL', 'email is required.');
    if (typeof input.email !== 'string' || !EMAIL_PATTERN.test(input.email)) {
      return sendError(res, 400, 'INVALID_EMAIL', 'email must be a valid email address.');
    }

    if (input.players === undefined || input.players === null || input.players === '') {
      return sendError(res, 400, 'MISSING_PLAYERS', 'players is required.');
    }
    if (!Number.isInteger(input.players) || input.players < 1) {
      return sendError(res, 400, 'INVALID_PLAYERS', 'players must be an integer of at least 1.');
    }

    if (!input.startDateTime) return sendError(res, 400, 'MISSING_START_TIME', 'startDateTime is required.');
    const startUtc = parseIsoInstant(input.startDateTime);
    if (!startUtc.isValid) return sendError(res, 400, 'INVALID_START_TIME', 'startDateTime must be a valid ISO datetime.');

    if (input.durationMinutes === undefined || input.durationMinutes === null || input.durationMinutes === '') {
      return sendError(res, 400, 'MISSING_DURATION', 'durationMinutes is required.');
    }
    if (!ALLOWED_DURATIONS.includes(input.durationMinutes)) {
      return sendError(res, 400, 'INVALID_DURATION', 'durationMinutes must be one of: 30, 60, 90, 120.');
    }

    if (typeof input.specialRequest !== 'string' || input.specialRequest.length > 500) {
      return sendError(res, 400, 'INVALID_SPECIAL_REQUEST', 'specialRequest must contain no more than 500 characters.');
    }

    const table = await Table.findById(input.tableId).lean();
    if (!table) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    if (!table.isActive) return sendError(res, 400, 'TABLE_INACTIVE', 'This table is inactive.');
    if (table.status === 'maintenance') return sendError(res, 400, 'TABLE_MAINTENANCE', 'This table is currently under maintenance.');
    if (table.status === 'unavailable') return sendError(res, 400, 'TABLE_UNAVAILABLE', 'This table is currently unavailable.');
    if (input.players > table.capacity) {
      return sendError(res, 400, 'TABLE_CAPACITY_EXCEEDED', `This table can accommodate a maximum of ${table.capacity} players.`);
    }

    const endUtc = startUtc.plus({ minutes: input.durationMinutes });
    const startDateTimeUtc = convertCafeTimeToUtc(startUtc);
    const endDateTimeUtc = convertCafeTimeToUtc(endUtc);
    const booking = new Booking({
      bookingReference: generateBookingReference(startDateTimeUtc),
      table: table._id,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email,
      players: input.players,
      startDateTime: startDateTimeUtc,
      endDateTime: endDateTimeUtc,
      durationMinutes: input.durationMinutes,
      specialRequest: input.specialRequest,
      status: 'confirmed',
      source: 'website',
      createdBy: 'customer',
      extensionMinutes: 0,
    });

    await booking.validate();

    // TODO: Stronger concurrency protection may use MongoDB transactions,
    // a booking-lock collection, or distributed locking. For this MVP, the
    // shared availability check runs immediately before the document is saved.
    const availability = await checkTableAvailability({
      tableId: input.tableId,
      startDateTime: startUtc.toUTC().toISO(),
      endDateTime: endUtc.toUTC().toISO(),
      durationMinutes: input.durationMinutes,
    });

    if (!availability.available) {
      if (availability.code === 'BOOKING_CONFLICT') {
        return sendError(res, 409, 'BOOKING_CONFLICT', 'This table is no longer available for the selected time.');
      }

      const statusCode = availability.code === 'TABLE_NOT_FOUND' ? 404 : 400;
      return sendError(res, statusCode, availability.code, availability.message);
    }

    await booking.save();

    return res.status(201).json({
      success: true,
      message: 'Reservation confirmed successfully.',
      data: {
        bookingReference: booking.bookingReference,
        customerName: booking.customerName,
        phone: booking.phone,
        email: booking.email,
        players: booking.players,
        startDateTime: booking.startDateTime.toISOString(),
        endDateTime: booking.endDateTime.toISOString(),
        durationMinutes: booking.durationMinutes,
        status: booking.status,
        table: {
          id: table._id.toString(),
          name: table.name,
          code: table.code,
          type: table.type,
          zone: table.zone,
          capacity: table.capacity,
        },
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((validationError) => validationError.message).join(' ');
      return sendError(res, 400, 'BOOKING_VALIDATION_ERROR', message);
    }

    console.error(`Create booking failed: ${error.message}`);
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Unable to create the reservation at this time.');
  }
};

// Development-only endpoint. Remove this temporary route before production.
const createTestBooking = async (req, res, next) => {
  try {
    const {
      tableId,
      customerName,
      phone,
      email,
      players,
      startDateTime,
      durationMinutes,
      specialRequest,
    } = req.body;

    const requiredFields = { tableId, customerName, phone, email, players, startDateTime, durationMinutes };
    const missingFields = Object.entries(requiredFields)
      .filter(([, value]) => value === undefined || value === null || value === '')
      .map(([field]) => field);

    if (missingFields.length) throw requestError(`Missing required fields: ${missingFields.join(', ')}`);

    const duration = Number(durationMinutes);
    if (!ALLOWED_DURATIONS.includes(duration)) throw requestError('durationMinutes must be one of: 30, 60, 90, 120.');
    if (!mongoose.isValidObjectId(tableId)) throw requestError('Invalid table ID.');

    const start = new Date(startDateTime);
    if (Number.isNaN(start.getTime())) throw requestError('startDateTime must be a valid date.');

    const playerCount = Number(players);
    if (!Number.isInteger(playerCount) || playerCount < 1) throw requestError('players must be a whole number of at least 1.');

    const table = await Table.findById(tableId);
    if (!table) throw requestError('Table not found.', 404);
    if (!table.isActive || table.status !== 'active') throw requestError('This table is currently inactive or unavailable.');
    if (playerCount > table.capacity) throw requestError(`Player count exceeds this table's capacity of ${table.capacity}.`);

    const endDateTime = new Date(start.getTime() + duration * 60 * 1000);
    const booking = await Booking.create({
      bookingReference: generateBookingReference(start),
      table: table._id,
      customerName,
      phone,
      email,
      players: playerCount,
      startDateTime: start,
      endDateTime,
      durationMinutes: duration,
      specialRequest: specialRequest || '',
    });

    await booking.populate('table', 'name code type zone capacity');

    res.status(201).json({ success: true, message: 'Test booking created successfully', data: booking });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
      error.message = Object.values(error.errors).map((validationError) => validationError.message).join(' ');
    }
    next(error);
  }
};

module.exports = { createBooking, createTestBooking };
