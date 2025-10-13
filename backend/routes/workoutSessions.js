const express = require('express');
const {
    getWorkoutSessions,
    getWorkoutSession,
    createWorkoutSession,
    updateWorkoutSession,
    deleteWorkoutSession,
} = require('../controllers/workoutSessions');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWorkoutSessions).post(protect, createWorkoutSession);

router
    .route('/:id')
    .get(protect, getWorkoutSession)
    .put(protect, updateWorkoutSession)
    .delete(protect, deleteWorkoutSession);

module.exports = router;