const WorkoutSession = require('../models/WorkoutSession');
const WorkoutPlan = require('../models/WorkoutPlan');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all workout sessions for the logged-in user
// @route   GET /api/v1/workoutsessions
// @access  Private
exports.getWorkoutSessions = asyncHandler(async (req, res, next) => {
    const sessions = await WorkoutSession.find({ user: req.user.id }).populate({
        path: 'performedExercises.exercise',
        select: 'name'
    }).populate('workoutPlan', 'name');

    res.status(200).json({
        success: true,
        count: sessions.length,
        data: sessions,
    });
});

// @desc    Create a new workout session
// @route   POST /api/v1/workoutsessions
// @access  Private
exports.createWorkoutSession = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    // Validate that the workout plan exists and belongs to the user
    const workoutPlan = await WorkoutPlan.findById(req.body.workoutPlan);
    if (!workoutPlan) {
        return next(new ErrorResponse(`Workout plan not found with id of ${req.body.workoutPlan}`, 404));
    }
    if (workoutPlan.user.toString() !== req.user.id) {
        return next(new ErrorResponse(`User not authorized to use this workout plan`, 401));
    }

    const session = await WorkoutSession.create(req.body);

    res.status(201).json({
        success: true,
        data: session,
    });
});