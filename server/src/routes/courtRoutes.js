const express = require('express');
const router = express.Router();
const {
    getCourts,
    getMyCourts,
    getCourt,
    createCourt,
    updateCourt,
    deleteCourt,
} = require('../controllers/courtController');

const { protect, admin, owner } = require('../middleware/authMiddleware');

router.route('/').get(getCourts).post(protect, owner, createCourt);
router.route('/mine').get(protect, owner, getMyCourts);
router
    .route('/:id')
    .get(getCourt)
    .put(protect, owner, updateCourt)
    .delete(protect, owner, deleteCourt);

module.exports = router;
