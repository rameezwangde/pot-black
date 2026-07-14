const mongoose = require('mongoose');
const Booking = require('../models/Booking');

const DEFAULT_TABLE_POPULATE = {
  path: 'table',
  select: 'name code type zone capacity',
};

const findBookingByIdentifier = async (identifier, populate = DEFAULT_TABLE_POPULATE) => {
  const normalizedIdentifier = typeof identifier === 'string' ? identifier.trim() : '';
  if (!normalizedIdentifier) return null;

  const filter = mongoose.isValidObjectId(normalizedIdentifier)
    ? { _id: normalizedIdentifier }
    : { bookingReference: normalizedIdentifier.toUpperCase() };

  const query = Booking.findOne(filter);
  if (populate) query.populate(populate === true ? DEFAULT_TABLE_POPULATE : populate);

  return query;
};

module.exports = findBookingByIdentifier;
