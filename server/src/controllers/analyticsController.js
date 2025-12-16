const Booking = require('../models/Booking');
const User = require('../models/User');
const Court = require('../models/Court');

// @desc    Get Admin Analytics
// @route   GET /api/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsers = await User.countDocuments();

        // 2. Total Bookings
        const totalBookings = await Booking.countDocuments();

        // 3. Total Revenue (sum of totalPrice) - Filter not cancelled?
        // Assuming status 'confirmed' or 'completed'
        const revenueAgg = await Booking.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 4. Revenue by Day (Last 7 days)
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 7);

        const dailyRevenue = await Booking.aggregate([
            {
                $match: {
                    status: { $ne: 'cancelled' },
                    createdAt: { $gte: last7Days }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: '$totalPrice' },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 5. Most Popular Courts
        const popularCourts = await Booking.aggregate([
            { $group: { _id: '$court', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 3 },
            { $lookup: { from: 'courts', localField: '_id', foreignField: '_id', as: 'courtDetails' } },
            { $unwind: '$courtDetails' },
            { $project: { name: '$courtDetails.name', count: 1 } }
        ]);


        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBookings,
                totalRevenue,
                dailyRevenue,
                popularCourts
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Analytics Error' });
    }
};
