const express = require('express');
const { createTestBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/test', createTestBooking);

module.exports = router;
