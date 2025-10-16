const Exercise = require('../models/Exercise');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all exercises
// @route   GET /api/v1/exercises
// @access  Private
exports.getExercises = asyncHandler(async (req, res, next) => {
    const exercises = await Exercise.find();
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
});

// @desc    Get single exercise
// @route   GET /api/v1/exercises/:id
// @access  Private
exports.getExercise = asyncHandler(async (req, res, next) => {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
        return next(new ErrorResponse(`Exercise not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: exercise });
});

// @desc    Create new exercise
// @route   POST /api/v1/exercises
// @access  Private
exports.createExercise = asyncHandler(async (req, res, next) => {
    const exercise = await Exercise.create(req.body);
    res.status(201).json({ success: true, data: exercise });
});

// @desc    Update exercise
// @route   PUT /api/v1/exercises/:id
// @access  Private
exports.updateExercise = asyncHandler(async (req, res, next) => {
    const exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!exercise) {
        return next(new ErrorResponse(`Exercise not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: exercise });
});

// @desc    Delete exercise
// @route   DELETE /api/v1/exercises/:id
// @access  Private
exports.deleteExercise = asyncHandler(async (req, res, next) => {
    const exercise = await Exercise.findByIdAndDelete(req.params.id);

    if (!exercise) {
        return next(new ErrorResponse(`Exercise not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});