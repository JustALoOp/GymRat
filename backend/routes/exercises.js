const express = require('express');
const {
    getExercises,
    getExercise,
    createExercise,
    updateExercise,
    deleteExercise,
} = require('../controllers/exercises');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/').get(protect, getExercises).post(protect, createExercise);

router
    .route('/:id')
    .get(protect, getExercise)
    .put(protect, updateExercise)
    .delete(protect, deleteExercise);

module.exports = router;