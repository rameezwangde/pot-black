const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

dotenv.config();

const ALLOWED_ROLES = ['owner', 'manager', 'receptionist'];

const seedAdmin = async () => {
  let exitCode = 0;

  try {
    const name = process.env.ADMIN_NAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const role = process.env.ADMIN_ROLE?.trim().toLowerCase();

    const missingVariables = [
      ['ADMIN_NAME', name],
      ['ADMIN_EMAIL', email],
      ['ADMIN_PASSWORD', password],
      ['ADMIN_ROLE', role],
    ].filter(([, value]) => !value).map(([key]) => key);

    if (missingVariables.length) {
      throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
    }

    if (!ALLOWED_ROLES.includes(role)) {
      throw new Error(`ADMIN_ROLE must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }

    if (password.length < 8) {
      throw new Error('ADMIN_PASSWORD must contain at least 8 characters.');
    }

    await connectDB();

    let admin = await Admin.findOne({ email });
    const action = admin ? 'updated' : 'created';

    if (admin) {
      admin.name = name;
      admin.password = password;
      admin.role = role;
      admin.isActive = true;
    } else {
      admin = new Admin({ name, email, password, role, isActive: true });
    }

    await admin.save();
    console.log(`First Pot Black admin ${action} successfully: ${admin.email} (${admin.role})`);
  } catch (error) {
    exitCode = 1;
    console.error(`Admin seed failed: ${error.message}`);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close().catch(() => {});
    }
    process.exit(exitCode);
  }
};

seedAdmin();
