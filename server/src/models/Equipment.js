const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add equipment name'],
    },
    type: {
        type: String,
        enum: ['racket', 'shoes', 'shuttlecock'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    price: {
        type: Number,
        required: true, // Price per booking/session
        default: 0,
    },
    status: {
        type: String,
        enum: ['available', 'out_of_stock'],
        default: 'available',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Equipment', equipmentSchema);
