const express = require('express');
const { getVolumeHistory } = require('../controllers/stats');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/volume-history/:exerciseId').get(protect, getVolumeHistory);

module.exports = router;