const Review = require('../models/Review');
const Court = require('../models/Court');
const Coach = require('../models/Coach');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        req.body.user = req.user.id;

        // Check if target exists
        let target;
        if (req.body.targetModel === 'Court') {
            target = await Court.findById(req.body.targetId);
        } else if (req.body.targetModel === 'Coach') {
            target = await Coach.findById(req.body.targetId);
        }

        if (!target) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        // Check for existing review
        const existingReview = await Review.findOne({
            user: req.user.id,
            targetId: req.body.targetId
        });

        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this resource' });
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a target
// @route   GET /api/reviews/:targetId
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId }).populate({
            path: 'user',
            select: 'name profileImage'
        });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
