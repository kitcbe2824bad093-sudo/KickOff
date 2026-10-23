const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Court',
      required: true
    },
    courtName: {
      type: String,
      required: true
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      squadSize: { type: Number, default: 10 }
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: [true, 'Booking date is required']
    },
    startTime: {
      type: String, // e.g. '07:00 PM' or '19:00'
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    // Time representations in minutes from midnight (0 to 1440) for precise overlap checks
    startMinutes: {
      type: Number,
      required: true
    },
    endMinutes: {
      type: Number,
      required: true
    },
    duration: {
      type: Number, // in hours: 1, 1.5, 2, etc.
      required: [true, 'Duration is required'],
      default: 1
    },
    addOns: [
      {
        name: { type: String },
        price: { type: Number }
      }
    ],
    courtRate: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    },
    notes: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    cancelledAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Compound index to accelerate slot availability queries
bookingSchema.index({ court: 1, date: 1, bookingStatus: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
