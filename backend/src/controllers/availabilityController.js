const { DateTime } = require('luxon');
const { checkTableAvailability } = require('../services/availabilityService');

const checkAvailability = async (req, res, next) => {
  try {
    const { tableId, startDateTime, durationMinutes } = req.body;

    if (!tableId) {
      return res.status(400).json({ success: false, available: false, code: 'MISSING_TABLE_ID', message: 'A table ID is required.' });
    }

    if (startDateTime === undefined || startDateTime === null || startDateTime === '') {
      return res.status(400).json({ success: false, available: false, code: 'MISSING_START_TIME', message: 'A booking start time is required.' });
    }

    if (durationMinutes === undefined || durationMinutes === null || durationMinutes === '') {
      return res.status(400).json({ success: false, available: false, code: 'MISSING_DURATION', message: 'A booking duration is required.' });
    }

    const startInstant = DateTime.fromISO(String(startDateTime), { setZone: true, zone: 'utc' });
    const duration = Number(durationMinutes);

    if (!startInstant.isValid) {
      return res.status(400).json({ success: false, available: false, code: 'INVALID_START_TIME', message: 'The booking start time must be a valid ISO datetime.' });
    }

    if (![30, 60, 90, 120].includes(duration)) {
      return res.status(400).json({ success: false, available: false, code: 'INVALID_DURATION', message: 'Duration must be one of: 30, 60, 90, 120 minutes.' });
    }

    const endInstant = startInstant.plus({ minutes: duration });
    const result = await checkTableAvailability({
      tableId,
      startDateTime: String(startDateTime),
      endDateTime: endInstant.toISO(),
      durationMinutes: duration,
    });

    if (!result.available) {
      const statusCode = result.code === 'BOOKING_CONFLICT' ? 409 : result.code === 'TABLE_NOT_FOUND' ? 404 : 400;
      const response = {
        success: false,
        available: false,
        code: result.code,
        message: result.message,
      };

      if (result.conflict) {
        response.conflict = {
          bookingReference: result.conflict.bookingReference,
          startDateTime: result.conflict.startDateTime,
          endDateTime: result.conflict.endDateTime,
          status: result.conflict.status,
        };
      }

      return res.status(statusCode).json(response);
    }

    return res.status(200).json({
      success: true,
      available: true,
      message: 'Table is available for the selected time.',
      data: {
        table: result.table,
        startDateTime: startInstant.toUTC().toISO(),
        endDateTime: endInstant.toUTC().toISO(),
        durationMinutes: duration,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { checkAvailability };
