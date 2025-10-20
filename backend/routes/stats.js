const express = require('express');
const { getVolumeHistory, getUniqueExercises, getOverallStats } = require('../controllers/stats');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/volume-history/:exerciseId').get(protect, getVolumeHistory);
router.route('/unique-exercises').get(protect, getUniqueExercises);
router.route('/overall').get(protect, getOverallStats);


module.exports = router;