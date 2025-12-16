const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add coach name'],
    },
    hourlyRate: {
        type: Number,
        required: true,
    },
    specialization: {
        type: String,
        default: 'General',
    },
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [{
            startTime: String, // "09:00"
            endTime: String,   // "17:00"
        }],
    }],
    averageRating: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Coach', coachSchema);
