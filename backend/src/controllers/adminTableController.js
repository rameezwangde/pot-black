const mongoose = require('mongoose');
const Table = require('../models/Table');
const Booking = require('../models/Booking');

const BLOCKING_STATUSES = ['pending', 'confirmed', 'checked-in', 'playing'];
const ACTIVE_SESSION_STATUSES = ['checked-in', 'playing'];
const TABLE_STATUSES = ['active', 'maintenance', 'unavailable'];

const sendError = (res, status, code, message) => res.status(status).json({ success: false, code, message });
const cleanFeatures = (features) => {
  if (!Array.isArray(features)) return [];
  return [...new Set(features.filter(value => typeof value === 'string').map(value => value.trim()).filter(Boolean))];
};
const normalizePayload = (body) => ({
  name: typeof body.name === 'string' ? body.name.trim() : '',
  code: typeof body.code === 'string' ? body.code.trim().toUpperCase() : '',
  type: typeof body.type === 'string' ? body.type.trim() : '',
  zone: typeof body.zone === 'string' ? body.zone.trim() : '',
  capacity: Number(body.capacity),
  features: cleanFeatures(body.features),
});
const validateTableData = (data) => {
  if (!data.name || !data.code || !data.type || !data.zone) return 'Name, code, type and zone are required.';
  if (!Number.isInteger(data.capacity) || data.capacity < 1) return 'Table capacity must be an integer of at least 1.';
  if (data.name.length > 100 || data.code.length > 20 || data.type.length > 100 || data.zone.length > 100) return 'Table fields exceed the allowed length.';
  return null;
};
const findConflict = async (data, excludeId) => {
  const name = await Table.findOne({ name: data.name, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).lean();
  if (name) return { code: 'TABLE_NAME_EXISTS', message: 'A table with this name already exists.' };
  const code = await Table.findOne({ code: data.code, ...(excludeId ? { _id: { $ne: excludeId } } : {}) }).lean();
  if (code) return { code: 'TABLE_CODE_EXISTS', message: 'A table with this code already exists.' };
  return null;
};
const bookingSummary = (booking) => booking ? {
  bookingReference: booking.bookingReference,
  customerName: booking.customerName,
  players: booking.players,
  startDateTime: booking.startDateTime,
  endDateTime: booking.endDateTime,
  status: booking.status,
} : null;

const getAdminTables = async (_req, res, next) => {
  try {
    const now = new Date();
    const tables = await Table.find().sort({ zone: 1, code: 1 }).lean();
    const ids = tables.map(table => table._id);
    const [currentBookings, nextBookings] = await Promise.all([
      Booking.find({ table: { $in: ids }, status: { $in: BLOCKING_STATUSES }, startDateTime: { $lte: now }, endDateTime: { $gt: now } }).sort({ startDateTime: 1 }).lean(),
      Booking.find({ table: { $in: ids }, status: { $in: BLOCKING_STATUSES }, startDateTime: { $gt: now } }).sort({ startDateTime: 1 }).lean(),
    ]);
    const currentByTable = new Map();
    const nextByTable = new Map();
    currentBookings.forEach(booking => { const key = booking.table.toString(); if (!currentByTable.has(key)) currentByTable.set(key, booking); });
    nextBookings.forEach(booking => { const key = booking.table.toString(); if (!nextByTable.has(key)) nextByTable.set(key, booking); });
    const data = tables.map(table => {
      const key = table._id.toString();
      const current = currentByTable.get(key);
      let operationalStatus = 'available';
      if (!table.isActive) operationalStatus = 'inactive';
      else if (table.status === 'maintenance') operationalStatus = 'maintenance';
      else if (table.status === 'unavailable') operationalStatus = 'unavailable';
      else if (current && ['playing', 'checked-in'].includes(current.status)) operationalStatus = 'occupied';
      else if (current && ['confirmed', 'pending'].includes(current.status)) operationalStatus = 'reserved';
      return { ...table, operationalStatus, currentBooking: bookingSummary(current), nextBooking: bookingSummary(nextByTable.get(key)) };
    });
    return res.status(200).json({ success: true, count: data.length, data });
  } catch (error) { return next(error); }
};

const createTable = async (req, res, next) => {
  try {
    const data = normalizePayload(req.body);
    const validation = validateTableData(data);
    if (validation) return sendError(res, validation.includes('capacity') ? 400 : 400, validation.includes('capacity') ? 'INVALID_TABLE_CAPACITY' : 'INVALID_TABLE_DATA', validation);
    const conflict = await findConflict(data);
    if (conflict) return sendError(res, 409, conflict.code, conflict.message);
    const table = await Table.create({ ...data, isActive: true, status: 'active' });
    return res.status(201).json({ success: true, message: 'Table created successfully.', data: { table } });
  } catch (error) {
    if (error.code === 11000) return sendError(res, 409, error.keyPattern?.name ? 'TABLE_NAME_EXISTS' : 'TABLE_CODE_EXISTS', 'A table with this name or code already exists.');
    return next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');
    const table = await Table.findById(req.params.id);
    if (!table) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    const data = normalizePayload({ name: req.body.name ?? table.name, code: req.body.code ?? table.code, type: req.body.type ?? table.type, zone: req.body.zone ?? table.zone, capacity: req.body.capacity ?? table.capacity, features: req.body.features ?? table.features });
    const validation = validateTableData(data);
    if (validation) return sendError(res, 400, validation.includes('capacity') ? 'INVALID_TABLE_CAPACITY' : 'INVALID_TABLE_DATA', validation);
    const conflict = await findConflict(data, table._id);
    if (conflict) return sendError(res, 409, conflict.code, conflict.message);
    if (data.capacity < table.capacity) {
      const capacityConflict = await Booking.exists({ table: table._id, status: { $in: BLOCKING_STATUSES }, endDateTime: { $gt: new Date() }, players: { $gt: data.capacity } });
      if (capacityConflict) return sendError(res, 409, 'TABLE_CAPACITY_CONFLICT', 'Table capacity cannot be reduced because an active or upcoming booking exceeds the new capacity.');
    }
    Object.assign(table, data);
    await table.save();
    return res.status(200).json({ success: true, message: 'Table updated successfully.', data: { table } });
  } catch (error) { return next(error); }
};

const updateTableStatus = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');
    const table = await Table.findById(req.params.id);
    if (!table) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    const status = req.body.status === undefined ? table.status : String(req.body.status).trim().toLowerCase();
    const isActive = req.body.isActive === undefined ? table.isActive : req.body.isActive;
    if (!TABLE_STATUSES.includes(status) || typeof isActive !== 'boolean') return sendError(res, 400, 'INVALID_TABLE_DATA', 'Valid status and boolean isActive values are required.');
    const restrictsAvailability = status !== 'active' || isActive === false;
    if (restrictsAvailability) {
      const now = new Date();
      const activeSession = await Booking.exists({ table: table._id, status: { $in: ACTIVE_SESSION_STATUSES }, startDateTime: { $lte: now }, endDateTime: { $gt: now } });
      if (activeSession) return sendError(res, 409, 'TABLE_HAS_ACTIVE_SESSION', 'This table has an active playing session and cannot be made unavailable.');
      const futureBooking = await Booking.exists({ table: table._id, status: { $in: BLOCKING_STATUSES }, startDateTime: { $gt: now } });
      if (futureBooking && req.body.force !== true) return sendError(res, 409, 'TABLE_HAS_FUTURE_BOOKINGS', 'This table has future bookings. Confirm a forced status change to continue.');
    }
    table.status = status; table.isActive = isActive; await table.save();
    return res.status(200).json({ success: true, message: 'Table status updated successfully.', data: { table } });
  } catch (error) { return next(error); }
};

const deactivateTable = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 400, 'INVALID_TABLE_ID', 'The table ID is invalid.');
    const table = await Table.findById(req.params.id);
    if (!table) return sendError(res, 404, 'TABLE_NOT_FOUND', 'Table not found.');
    const now = new Date();
    const activeSession = await Booking.exists({ table: table._id, status: { $in: ACTIVE_SESSION_STATUSES }, startDateTime: { $lte: now }, endDateTime: { $gt: now } });
    if (activeSession) return sendError(res, 409, 'TABLE_HAS_ACTIVE_SESSION', 'This table has an active playing session and cannot be deactivated.');
    const futureBooking = await Booking.exists({ table: table._id, status: { $in: BLOCKING_STATUSES }, startDateTime: { $gt: now } });
    if (futureBooking) return sendError(res, 409, 'TABLE_HAS_FUTURE_BOOKINGS', 'This table has future bookings and cannot be deactivated.');
    table.isActive = false; await table.save();
    return res.status(200).json({ success: true, message: 'Table deactivated successfully.' });
  } catch (error) { return next(error); }
};

module.exports = { createTable, deactivateTable, getAdminTables, updateTable, updateTableStatus };

