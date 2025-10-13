const WorkoutPlan = require('../models/WorkoutPlan');

// @desc    Get all workout plans
// @route   GET /api/v1/workoutplans
// @access  Private
exports.getWorkoutPlans = async (req, res, next) => {
    try {
        const workoutPlans = await WorkoutPlan.find({ user: req.user.id });
        res.status(200).json({ success: true, count: workoutPlans.length, data: workoutPlans });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single workout plan
// @route   GET /api/v1/workoutplans/:id
// @access  Private
exports.getWorkoutPlan = async (req, res, next) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id).populate('exercises.exercise');

        if (!workoutPlan) {
            return res.status(404).json({ success: false, error: 'Workout plan not found' });
        }

        // Make sure user is workout plan owner
        if (workoutPlan.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to access this workout plan' });
        }

        res.status(200).json({ success: true, data: workoutPlan });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new workout plan
// @route   POST /api/v1/workoutplans
// @access  Private
exports.createWorkoutPlan = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const workoutPlan = await WorkoutPlan.create(req.body);
        res.status(201).json({ success: true, data: workoutPlan });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update workout plan
// @route   PUT /api/v1/workoutplans/:id
// @access  Private
exports.updateWorkoutPlan = async (req, res, next) => {
    try {
        let workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({ success: false, error: 'Workout plan not found' });
        }

        // Make sure user is workout plan owner
        if (workoutPlan.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this workout plan' });
        }

        workoutPlan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: workoutPlan });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete workout plan
// @route   DELETE /api/v1/workoutplans/:id
// @access  Private
exports.deleteWorkoutPlan = async (req, res, next) => {
    try {
        const workoutPlan = await WorkoutPlan.findById(req.params.id);

        if (!workoutPlan) {
            return res.status(404).json({ success: false, error: 'Workout plan not found' });
        }

        // Make sure user is workout plan owner
        if (workoutPlan.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this workout plan' });
        }

        await workoutPlan.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};