const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const generateBookingReference = require('../utils/generateBookingReference');

const ALLOWED_DURATIONS = [30, 60, 90, 120];

const requestError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

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

    if (missingFields.length) {
      throw requestError(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const duration = Number(durationMinutes);
    if (!ALLOWED_DURATIONS.includes(duration)) {
      throw requestError('durationMinutes must be one of: 30, 60, 90, 120.');
    }

    if (!mongoose.isValidObjectId(tableId)) {
      throw requestError('Invalid table ID.');
    }

    const start = new Date(startDateTime);
    if (Number.isNaN(start.getTime())) {
      throw requestError('startDateTime must be a valid date.');
    }

    const playerCount = Number(players);
    if (!Number.isInteger(playerCount) || playerCount < 1) {
      throw requestError('players must be a whole number of at least 1.');
    }

    const table = await Table.findById(tableId);
    if (!table) {
      throw requestError('Table not found.', 404);
    }

    if (!table.isActive || table.status !== 'active') {
      throw requestError('This table is currently inactive or unavailable.');
    }

    if (playerCount > table.capacity) {
      throw requestError(`Player count exceeds this table's capacity of ${table.capacity}.`);
    }

    const endDateTime = new Date(start.getTime() + duration * 60 * 1000);

    // TODO: Add booking overlap and availability validation in the next step.
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

    res.status(201).json({
      success: true,
      message: 'Test booking created successfully',
      data: booking,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
      error.message = Object.values(error.errors).map((validationError) => validationError.message).join(' ');
    }

    next(error);
  }
};

module.exports = { createTestBooking };
