const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    court: {
        type: mongoose.Schema.ObjectId,
        ref: 'Court',
        required: true,
    },
    equipment: [{
        item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Equipment',
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],
    coach: {
        type: mongoose.Schema.ObjectId,
        ref: 'Coach',
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    breakdown: {
        type: Object, // Stores detailed pricing breakdown
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled', 'pending'],
        default: 'confirmed',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for query performance and preventing double bookings (if not using transactions purely)
// Compound index: court + startTime (this is tricky with ranges, validation logic handles range overlap)
bookingSchema.index({ court: 1, startTime: 1, endTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
