const Court = require('../models/Court');

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
exports.getCourts = async (req, res) => {
    try {
        const courts = await Court.find();
        res.status(200).json({ success: true, count: courts.length, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user's courts
// @route   GET /api/courts/mine
// @access  Private (Owner)
exports.getMyCourts = async (req, res) => {
    try {
        const courts = await Court.find({ owner: req.user.id });
        res.status(200).json({ success: true, count: courts.length, data: courts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single court
// @route   GET /api/courts/:id
// @access  Public
exports.getCourt = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }
        res.status(200).json({ success: true, data: court });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new court
// @route   POST /api/courts
// @access  Private (Owner/Admin)
exports.createCourt = async (req, res) => {
    try {
        // Add user to req.body
        req.body.owner = req.user.id;

        const court = await Court.create(req.body);
        res.status(201).json({ success: true, data: court });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update court
// @route   PUT /api/courts/:id
// @access  Private (Owner/Admin)
exports.updateCourt = async (req, res) => {
    try {
        let court = await Court.findById(req.params.id);

        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }

        // Make sure user is court owner or admin
        if (court.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this court' });
        }

        court = await Court.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: court });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete court
// @route   DELETE /api/courts/:id
// @access  Private (Owner/Admin)
exports.deleteCourt = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) {
            return res.status(404).json({ success: false, message: 'Court not found' });
        }

        // Make sure user is court owner or admin
        if (court.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this court' });
        }

        await court.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
