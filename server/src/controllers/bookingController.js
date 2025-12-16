const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const pricingService = require('../services/pricingService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const { courtId, equipmentIds, coachId, date, startTime, endTime } = req.body;
        // startTime/endTime should be full ISO strings: "2023-10-27T18:00:00.000Z"

        // 1. Check Availability (Concurrency Check)
        // Find any booking that overlaps with requested time for SAME court
        const existing = await Booking.findOne({
            court: courtId,
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } } // Envelops
            ],
            status: 'confirmed'
        }); // .session(session);

        if (existing) {
            // await session.abortTransaction();
            return res.status(400).json({ success: false, message: 'Court already booked for this slot' });
        }

        // 2. Calculate Price
        const pricing = await pricingService.calculatePrice({
            courtId,
            equipmentIds, // [{ item: id, quantity: 1 }]
            coachId,
            date,
            startTime,
            endTime
        });

        // 3. Create Booking
        const booking = await Booking.create([{
            user: req.user.id,
            court: courtId,
            equipment: equipmentIds,
            coach: coachId,
            startTime,
            endTime,
            totalPrice: pricing.totalPrice,
            breakdown: pricing.breakdown,
            status: 'confirmed'
        }]); // , { session });

        // await session.commitTransaction();
        res.status(201).json({ success: true, data: booking[0] });

    } catch (error) {
        // await session.abortTransaction();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        // session.endSession();
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id }).populate('court').populate('coach');
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
