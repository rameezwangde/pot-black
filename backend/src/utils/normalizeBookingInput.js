const normalizeNumber = (value) => {
  if (value === undefined || value === null || value === '') return value;
  return Number(value);
};

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : value);

const normalizeBookingInput = (input = {}) => ({
  tableId: normalizeString(input.tableId),
  customerName: normalizeString(input.customerName),
  phone: normalizeString(input.phone),
  email: typeof input.email === 'string' ? input.email.trim().toLowerCase() : input.email,
  players: normalizeNumber(input.players),
  startDateTime: normalizeString(input.startDateTime),
  durationMinutes: normalizeNumber(input.durationMinutes),
  specialRequest: input.specialRequest === undefined
    ? ''
    : normalizeString(input.specialRequest),
});

module.exports = normalizeBookingInput;
