const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendError = (res, statusCode, code, message) => res.status(statusCode).json({
  success: false,
  code,
  message,
});

const loginAdmin = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (!email) return sendError(res, 400, 'EMAIL_REQUIRED', 'Email is required.');
    if (!password) return sendError(res, 400, 'PASSWORD_REQUIRED', 'Password is required.');

    if (!EMAIL_PATTERN.test(email)) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
    }

    if (!admin.isActive) {
      return sendError(res, 403, 'ADMIN_INACTIVE', 'This admin account is inactive.');
    }

    admin.lastLoginAt = new Date();
    await admin.save();

    const token = generateToken({ adminId: admin._id, role: admin.role });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { token, admin: admin.toSafeObject() },
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentAdmin = (req, res) => res.status(200).json({
  success: true,
  data: { admin: req.admin.toSafeObject() },
});

module.exports = { getCurrentAdmin, loginAdmin };
