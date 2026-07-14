const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminBookingRoutes = require('./routes/adminBookingRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const adminTableRoutes = require('./routes/adminTableRoutes');

const app = express();

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, '');
const environmentOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);
const allowedOrigins = new Set([
  'http://localhost:3001',
  'https://pot-black.vercel.app',
  ...environmentOrigins,
]);

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    const error = new Error('Origin is not allowed by CORS.');
    error.statusCode = 403;
    error.code = 'CORS_NOT_ALLOWED';
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pot Black booking API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/tables', adminTableRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin', adminAuthRoutes);

app.use((req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
});

// Centralized error handler. Internal details are logged server-side and never returned to clients.
app.use((error, req, res, _next) => {
  let statusCode = Number(error.statusCode || error.status) || 500;
  let code = typeof error.code === 'string' ? error.code : 'INTERNAL_SERVER_ERROR';
  let message = error.message || 'The request could not be completed.';

  if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
    statusCode = 400;
    code = 'INVALID_JSON';
    message = 'The request body contains invalid JSON.';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Some submitted information is invalid.';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_IDENTIFIER';
    message = 'The supplied identifier is invalid.';
  } else if (error.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_RECORD';
    message = 'A record with those details already exists.';
  }

  const safeClientMessage = typeof message === 'string'
    && message.length <= 240
    && !/(node_modules|stack|validationerror|casterror|mongoserver|econn|\bat\s+\S+\s*\(|error:\s)/i.test(message);
  if (!safeClientMessage) message = 'The request could not be completed. Please try again.';

  if (statusCode >= 500) {
    console.error(`Unhandled API error on ${req.method} ${req.originalUrl}:`, error);
    statusCode = 500;
    code = 'INTERNAL_SERVER_ERROR';
    message = 'Pot Black services are temporarily unavailable. Please try again shortly.';
  }

  res.status(statusCode).json({ success: false, code, message });
});

module.exports = app;