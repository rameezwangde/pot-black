const express = require('express');
const {
  createWalkInBooking,
  getAdminBookingById,
  getAdminBookings,
  updateBookingStatus,
} = require('../controllers/adminBookingController');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

router.use(authenticateAdmin);

router.get('/', getAdminBookings);
router.post('/walk-in', createWalkInBooking);
router.get('/:id', getAdminBookingById);
router.patch('/:id/status', updateBookingStatus);

module.exports = router;
