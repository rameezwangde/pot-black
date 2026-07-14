const express = require('express');
const {
  cancelBooking,
  createWalkInBooking,
  extendBooking,
  getAdminBookingById,
  getAdminBookings,
  moveBookingToTable,
  updateBookingStatus,
} = require('../controllers/adminBookingController');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminBookings);
router.post('/walk-in', createWalkInBooking);
router.patch('/:id/extend', extendBooking);
router.patch('/:id/cancel', cancelBooking);
router.patch('/:id/table', moveBookingToTable);
router.get('/:id', getAdminBookingById);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
