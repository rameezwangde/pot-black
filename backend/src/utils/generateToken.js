const jwt = require('jsonwebtoken');

const generateToken = ({ adminId, role }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add it to backend/.env before generating tokens.');
  }

  return jwt.sign(
    { adminId: adminId.toString(), role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
  );
};

module.exports = generateToken;
