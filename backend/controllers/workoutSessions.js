const WorkoutSession = require('../models/WorkoutSession');

// @desc    Get all workout sessions
// @route   GET /api/v1/workoutsessions
// @access  Private
exports.getWorkoutSessions = async (req, res, next) => {
    try {
        const workoutSessions = await WorkoutSession.find({ user: req.user.id }).populate({
            path: 'exercises.exercise',
            select: 'name muscleGroup'
        });
        res.status(200).json({ success: true, count: workoutSessions.length, data: workoutSessions });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single workout session
// @route   GET /api/v1/workoutsessions/:id
// @access  Private
exports.getWorkoutSession = async (req, res, next) => {
    try {
        const workoutSession = await WorkoutSession.findById(req.params.id).populate({
            path: 'exercises.exercise',
            select: 'name muscleGroup'
        });

        if (!workoutSession) {
            return res.status(404).json({ success: false, error: 'Workout session not found' });
        }

        // Make sure user is workout session owner
        if (workoutSession.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this workout session' });
        }

        res.status(200).json({ success: true, data: workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new workout session
// @route   POST /api/v1/workoutsessions
// @access  Private
exports.createWorkoutSession = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const workoutSession = await WorkoutSession.create(req.body);
        res.status(201).json({ success: true, data: workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update workout session
// @route   PUT /api/v1/workoutsessions/:id
// @access  Private
exports.updateWorkoutSession = async (req, res, next) => {
    try {
        let workoutSession = await WorkoutSession.findById(req.params.id);

        if (!workoutSession) {
            return res.status(404).json({ success: false, error: 'Workout session not found' });
        }

        // Make sure user is workout session owner
        if (workoutSession.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this workout session' });
        }

        workoutSession = await WorkoutSession.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete workout session
// @route   DELETE /api/v1/workoutsessions/:id
// @access  Private
exports.deleteWorkoutSession = async (req, res, next) => {
    try {
        const workoutSession = await WorkoutSession.findById(req.params.id);

        if (!workoutSession) {
            return res.status(404).json({ success: false, error: 'Workout session not found' });
        }

        // Make sure user is workout session owner
        if (workoutSession.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this workout session' });
        }

        await workoutSession.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};