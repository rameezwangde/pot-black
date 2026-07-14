const crypto = require('crypto');

const REFERENCE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateBookingReference = (startDate) => {
  const date = startDate ? new Date(startDate) : new Date();

  if (Number.isNaN(date.getTime())) {
    throw new Error('A valid booking start date is required to generate a reference.');
  }

  const datePart = [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('');

  const randomPart = Array.from(
    { length: 4 },
    () => REFERENCE_CHARACTERS[crypto.randomInt(REFERENCE_CHARACTERS.length)],
  ).join('');

  return `PB-${datePart}-${randomPart}`;
};

module.exports = generateBookingReference;
