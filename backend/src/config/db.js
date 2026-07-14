const mongoose = require('mongoose');

let connectionPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 0) {
    connectionPromise = undefined;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Add it to the backend environment before starting the server.');
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI)
      .then((mongooseInstance) => {
        console.log(`MongoDB connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance.connection;
      })
      .catch(() => {
        connectionPromise = undefined;
        console.error('MongoDB connection failed.');
        throw new Error('MongoDB connection could not be established.');
      });
  }

  return connectionPromise;
};

module.exports = connectDB;