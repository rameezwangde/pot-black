const { DateTime } = require('luxon');
const Booking = require('../models/Booking');
const Table = require('../models/Table');
const { getCafeTimezone } = require('../utils/timezone');

const TABLE_FIELDS = 'name code type zone capacity';

const getAdminDashboard = async (_req, res, next) => {
  try {
    const timezone = getCafeTimezone();
    const nowUtc = new Date();
    const todayDubai = DateTime.now().setZone(timezone);
    const dayStartUtc = todayDubai.startOf('day').toUTC().toJSDate();
    const dayEndUtc = todayDubai.plus({ days: 1 }).startOf('day').toUTC().toJSDate();
    const todayFilter = { startDateTime: { $gte: dayStartUtc, $lt: dayEndUtc } };

    const [todaySummary, activeTables, occupiedTableIds, upcomingBookings, activeBookings, playingNow] = await Promise.all([
      Booking.aggregate([
        { $match: todayFilter },
        {
          $group: {
            _id: null,
            totalBookingsToday: { $sum: 1 },
            confirmedToday: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
            checkedInToday: { $sum: { $cond: [{ $eq: ['$status', 'checked-in'] }, 1, 0] } },
            completedToday: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            cancelledToday: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
            noShowToday: { $sum: { $cond: [{ $eq: ['$status', 'no-show'] }, 1, 0] } },
            walkInsToday: { $sum: { $cond: [{ $eq: ['$source', 'walk-in'] }, 1, 0] } },
            websiteBookingsToday: { $sum: { $cond: [{ $eq: ['$source', 'website'] }, 1, 0] } },
          },
        },
      ]),
      Table.find({ isActive: true, status: 'active' }).select('_id').lean(),
      Booking.distinct('table', {
        status: { $in: ['confirmed', 'checked-in', 'playing'] },
        startDateTime: { $lte: nowUtc },
        endDateTime: { $gt: nowUtc },
      }),
      Booking.find({
        status: { $in: ['pending', 'confirmed', 'checked-in'] },
        startDateTime: { $gt: nowUtc },
      })
        .select('-__v')
        .populate('table', TABLE_FIELDS)
        .sort({ startDateTime: 1 })
        .limit(10)
        .lean(),
      Booking.find({
        status: { $in: ['confirmed', 'checked-in', 'playing'] },
        startDateTime: { $lte: nowUtc },
        endDateTime: { $gt: nowUtc },
      })
        .select('-__v')
        .populate('table', TABLE_FIELDS)
        .sort({ startDateTime: 1 })
        .lean(),
      Booking.countDocuments({
        status: 'playing',
        startDateTime: { $lte: nowUtc },
        endDateTime: { $gt: nowUtc },
      }),
    ]);

    const counts = todaySummary[0] || {};
    const activeTableIds = new Set(activeTables.map((table) => table._id.toString()));
    const occupiedTablesNow = occupiedTableIds.filter((tableId) => activeTableIds.has(tableId.toString())).length;
    const totalActiveTables = activeTables.length;

    return res.status(200).json({
      success: true,
      data: {
        date: todayDubai.toISODate(),
        timezone,
        summary: {
          totalBookingsToday: counts.totalBookingsToday || 0,
          confirmedToday: counts.confirmedToday || 0,
          checkedInToday: counts.checkedInToday || 0,
          playingNow,
          completedToday: counts.completedToday || 0,
          cancelledToday: counts.cancelledToday || 0,
          noShowToday: counts.noShowToday || 0,
          walkInsToday: counts.walkInsToday || 0,
          websiteBookingsToday: counts.websiteBookingsToday || 0,
          occupiedTablesNow,
          availableTablesNow: Math.max(totalActiveTables - occupiedTablesNow, 0),
          totalActiveTables,
        },
        upcomingBookings,
        activeBookings,
      },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getAdminDashboard };
