const dotenv = require('dotenv');

dotenv.config();

const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
let server;
let isShuttingDown = false;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Pot Black booking API listening on port ${PORT}`);
    });
  } catch {
    console.error('Server startup aborted: MongoDB connection could not be established.');
    process.exit(1);
  }
};

const closeHttpServer = () => new Promise((resolve, reject) => {
  if (!server) {
    resolve();
    return;
  }

  server.close((error) => {
    if (error) reject(error);
    else resolve();
  });
});

const shutdown = async (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received. Shutting down gracefully...`);

  try {
    await closeHttpServer();
    console.log('HTTP server closed');

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }

    process.exit(0);
  } catch {
    console.error('Graceful shutdown failed.');
    process.exit(1);
  }
};

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

void startServer();