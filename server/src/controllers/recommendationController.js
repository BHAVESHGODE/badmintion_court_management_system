const Coach = require('../models/Coach');
// const Equipment = require('../models/Equipment'); // Assuming Equipment model exists or we mock it

// @desc    Get AI recommendations
// @route   POST /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
    try {
        const user = req.user;
        const { courtId, startTime } = req.body;

        const recommendations = [];

        // Mock Equipment Data (since we don't have a full Equipment model populated yet maybe? Or we do?)
        // Let's assume we return static equipment data for now if model isn't ready, or query if it is.
        // I'll return mock data for stability as per "Dry Run" philosophy, but structured.

        if (user.skillLevel === 'Beginner') {
            const coaches = await Coach.find({ specialization: 'Beginners' }).limit(1);
            if (coaches.length > 0) {
                recommendations.push({
                    type: 'Coach',
                    item: coaches[0],
                    reason: 'Perfect for getting started based on your skill level.'
                });
            }
            recommendations.push({
                type: 'Equipment',
                item: { _id: 'e_beginner_racket', name: 'Starter Racket', price: 50, image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400' },
                reason: 'Lightweight racket recommended for new players.'
            });
        } else if (user.skillLevel === 'Intermediate') {
            recommendations.push({
                type: 'Equipment',
                item: { _id: 'e_shoes', name: 'Pro Court Shoes', price: 100, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
                reason: 'Essential for preventing injuries at your intensity.'
            });
        } else if (user.skillLevel === 'Advanced' || user.skillLevel === 'Pro') {
            const coaches = await Coach.find({ specialization: 'Advanced Tactics' }).limit(1);
            if (coaches.length > 0) {
                recommendations.push({
                    type: 'Coach',
                    item: coaches[0],
                    reason: 'Refine your strategy with pro-level coaching.'
                });
            }
            recommendations.push({
                type: 'Equipment',
                item: { _id: 'e_pro_racket', name: 'Yonex Astrox 99', price: 200, image: 'https://images.unsplash.com/photo-1613946890333-b78913b8296a?w=400' },
                reason: 'Top-tier power for your smash game.'
            });
        }

        // Add a generic one
        recommendations.push({
            type: 'Equipment',
            item: { _id: 'e_shuttles', name: 'Shuttlecock Tube (Feather)', price: 25, image: 'https://images.unsplash.com/photo-1627844654924-42b7857185ae?w=400' },
            reason: 'High durability shuttles for your session.'
        });

        // Simulate AI Processing Delay for effect on frontend? No, frontend handles animation.

        res.status(200).json({
            success: true,
            data: recommendations
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'AI Engine Error' });
    }
};
