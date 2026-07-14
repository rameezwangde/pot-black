const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
const app = require('../src/app');
const connectDB = require('../src/config/db');

let connectionPromise;

async function ensureDatabaseConnection() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!connectionPromise) {
    connectionPromise = connectDB().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
}

module.exports = async function handler(req, res) {
  try {
    await ensureDatabaseConnection();
  } catch {
    console.error('Vercel request rejected because MongoDB is unavailable.');
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({
      success: false,
      code: 'DATABASE_UNAVAILABLE',
      message: 'Pot Black services are temporarily unavailable. Please try again shortly.',
    }));
    return undefined;
  }

  return app(req, res);
};