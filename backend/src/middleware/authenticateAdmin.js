const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const authError = (res, statusCode, code, message) => res.status(statusCode).json({
  success: false,
  code,
  message,
});

const authenticateAdmin = async (req, res, next) => {
  const authorization = req.get('Authorization');

  if (!authorization) {
    return authError(res, 401, 'AUTH_TOKEN_REQUIRED', 'An admin authentication token is required.');
  }

  const parts = authorization.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return authError(res, 401, 'AUTH_TOKEN_INVALID', 'The authentication token is invalid.');
  }

  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is missing. Add it to backend/.env before authenticating tokens.');
    error.statusCode = 500;
    return next(error);
  }

  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    if (!payload.adminId || !mongoose.isValidObjectId(payload.adminId)) {
      return authError(res, 401, 'AUTH_TOKEN_INVALID', 'The authentication token is invalid.');
    }

    const admin = await Admin.findById(payload.adminId);
    if (!admin) {
      return authError(res, 401, 'ADMIN_NOT_FOUND', 'The admin account associated with this token no longer exists.');
    }

    if (!admin.isActive) {
      return authError(res, 403, 'ADMIN_INACTIVE', 'This admin account is inactive.');
    }

    req.admin = admin;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return authError(res, 401, 'AUTH_TOKEN_EXPIRED', 'The authentication token has expired.');
    }

    if (error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError') {
      return authError(res, 401, 'AUTH_TOKEN_INVALID', 'The authentication token is invalid.');
    }

    return next(error);
  }
};

module.exports = authenticateAdmin;
