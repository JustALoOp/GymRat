const express = require('express');
const {
    getWorkoutSessions,
    createWorkoutSession,
} = require('../controllers/workoutSessions');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(protect, getWorkoutSessions)
    .post(protect, createWorkoutSession);

module.exports = router;