const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String, // "18:00"
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'notified', 'expired'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Waitlist', waitlistSchema);
