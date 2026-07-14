const express = require('express');
const { createBooking, createTestBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/', createBooking);

// Development-only route. Remove before production.
router.post('/test', createTestBooking);

module.exports = router;
