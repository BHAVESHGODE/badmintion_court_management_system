const express = require('express');
const router = express.Router();
const { joinWaitlist, getMyWaitlist } = require('../controllers/waitlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, joinWaitlist);
router.get('/my', protect, getMyWaitlist);

module.exports = router;
