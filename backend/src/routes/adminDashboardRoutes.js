const express = require('express');
const { getAdminDashboard } = require('../controllers/adminDashboardController');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

router.get('/', authenticateAdmin, getAdminDashboard);

module.exports = router;
