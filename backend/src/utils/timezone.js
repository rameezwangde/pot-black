const { DateTime, IANAZone } = require('luxon');

const getCafeTimezone = () => process.env.CAFE_TIMEZONE || 'Asia/Dubai';

const parseIsoInstant = (value) => {
  if (value instanceof Date) {
    return DateTime.fromJSDate(value, { zone: 'utc' });
  }

  if (typeof value !== 'string') {
    return DateTime.invalid('Unsupported date value');
  }

  // An explicit offset/Z is preserved. Offset-free ISO values default to UTC,
  // never to the server machine's local timezone.
  return DateTime.fromISO(value, { setZone: true, zone: 'utc' }).toUTC();
};

const parseIsoToCafeTime = (value, timezone = getCafeTimezone()) => {
  if (!IANAZone.isValidZone(timezone)) {
    return DateTime.invalid('Invalid café timezone');
  }

  return parseIsoInstant(value).setZone(timezone);
};

const convertCafeTimeToUtc = (value) => {
  const dateTime = DateTime.isDateTime(value) ? value : parseIsoInstant(value);
  return new Date(dateTime.toUTC().toISO());
};

const buildCafeBusinessWindow = (bookingDateTime, openingHour, closingHour) => ({
  openingDateTime: bookingDateTime.set({
    hour: openingHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),
  closingDateTime: bookingDateTime.set({
    hour: closingHour,
    minute: 0,
    second: 0,
    millisecond: 0,
  }),
});

module.exports = {
  buildCafeBusinessWindow,
  convertCafeTimeToUtc,
  getCafeTimezone,
  parseIsoInstant,
  parseIsoToCafeTime,
};
