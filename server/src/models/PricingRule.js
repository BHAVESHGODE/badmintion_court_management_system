const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['multiplier', 'fixed_addition'],
        required: true,
    },
    value: {
        type: Number,
        required: true, // e.g., 1.2 for 20% increase, or 50 for +50 rs
    },
    conditions: {
        days: [{
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        }],
        startTime: String, // "18:00"
        endTime: String,   // "21:00"
        courtType: {
            type: String,
            enum: ['indoor', 'outdoor'],
        },
    },
    priority: {
        type: Number,
        default: 0, // Higher applies later/overrides or stacks?? Plan: Stacking multipliers.
    },
    enabled: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
