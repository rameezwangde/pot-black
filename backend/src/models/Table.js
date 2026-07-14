const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    zone: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    features: {
      type: [{ type: String, trim: true }],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'unavailable'],
      default: 'active',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Table', tableSchema);
