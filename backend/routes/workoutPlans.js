const express = require('express');
const {
    getWorkoutPlans,
    getWorkoutPlan,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
} = require('../controllers/workoutPlans');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getWorkoutPlans).post(protect, createWorkoutPlan);

router
    .route('/:id')
    .get(protect, getWorkoutPlan)
    .put(protect, updateWorkoutPlan)
    .delete(protect, deleteWorkoutPlan);

module.exports = router;