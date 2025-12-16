const Waitlist = require('../models/Waitlist');
const Booking = require('../models/Booking');

// @desc    Join Waitlist
// @route   POST /api/waitlist
// @access  Private
exports.joinWaitlist = async (req, res) => {
    try {
        const { courtId, date, time } = req.body;

        // Ensure slot is actually full (optional check)
        // Create Waitlist entry
        const entry = await Waitlist.create({
            user: req.user.id,
            court: courtId,
            date,
            time
        });

        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Waitlist for User
// @route   GET /api/waitlist/my
// @access  Private
exports.getMyWaitlist = async (req, res) => {
    try {
        const list = await Waitlist.find({ user: req.user.id }).populate('court');
        res.status(200).json({ success: true, data: list });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
