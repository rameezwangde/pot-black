const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { getCurrentAdmin, loginAdmin } = require('../controllers/adminAuthController');
const authenticateAdmin = require('../middleware/authenticateAdmin');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => res.status(429).json({
    success: false,
    code: 'TOO_MANY_LOGIN_ATTEMPTS',
    message: 'Too many login attempts. Please try again later.',
  }),
});

router.post('/login', loginLimiter, loginAdmin);
router.get('/me', authenticateAdmin, getCurrentAdmin);

module.exports = router;
