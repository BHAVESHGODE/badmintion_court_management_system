const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'targetModel'
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['Court', 'Coach']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating between 1 and 5'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        maxLength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting multiple reviews for same resource
reviewSchema.index({ user: 1, targetId: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function (targetId, targetModel) {
    const obj = await this.aggregate([
        {
            $match: { targetId: targetId }
        },
        {
            $group: {
                _id: '$targetId',
                averageRating: { $avg: '$rating' },
                count: { $sum: 1 }
            }
        }
    ]);

    try {
        const Model = mongoose.model(targetModel);
        if (obj[0]) {
            await Model.findByIdAndUpdate(targetId, {
                averageRating: obj[0].averageRating.toFixed(1),
                ratingCount: obj[0].count
            });
        } else {
            await Model.findByIdAndUpdate(targetId, {
                averageRating: 0,
                ratingCount: 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after save
reviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.targetId, this.targetModel);
});

// Call getAverageRating before remove
reviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.targetId, this.targetModel);
});

module.exports = mongoose.model('Review', reviewSchema);
