const express = require('express');
const { getVolumeHistory, getUniqueExercises } = require('../controllers/stats');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/volume-history/:exerciseId').get(protect, getVolumeHistory);
router.route('/unique-exercises').get(protect, getUniqueExercises);

module.exports = router;