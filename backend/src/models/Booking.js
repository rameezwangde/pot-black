const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Table',
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    players: {
      type: Number,
      required: true,
      min: 1,
    },
    startDateTime: {
      type: Date,
      required: true,
      index: true,
    },
    endDateTime: {
      type: Date,
      required: true,
      index: true,
      validate: {
        validator(value) {
          return !this.startDateTime || value > this.startDateTime;
        },
        message: 'End time must be later than start time.',
      },
    },
    durationMinutes: {
      type: Number,
      required: true,
      enum: [30, 60, 90, 120],
    },
    specialRequest: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'playing', 'completed', 'cancelled', 'no-show'],
      default: 'confirmed',
      index: true,
    },
    source: {
      type: String,
      enum: ['website', 'walk-in', 'phone', 'admin'],
      default: 'website',
    },
    createdBy: {
      type: String,
      enum: ['customer', 'admin', 'staff', 'system'],
      default: 'customer',
    },
    extensionMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 300,
      default: '',
    },
  },
  { timestamps: true },
);

bookingSchema.index({ table: 1, startDateTime: 1 });
bookingSchema.index({ table: 1, endDateTime: 1 });
bookingSchema.index({ table: 1, status: 1 });
bookingSchema.index({ startDateTime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
