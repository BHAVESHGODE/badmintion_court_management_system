const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a court name'],
        unique: true,
    },
    type: {
        type: String,
        enum: ['indoor', 'outdoor'],
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    basePrice: {
        type: Number,
        required: true,
        default: 100, // Base price per hour
    },
    status: {
        type: String,
        enum: ['active', 'maintenance', 'disabled'],
        default: 'active',
    },
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

module.exports = mongoose.model('Court', courtSchema);
