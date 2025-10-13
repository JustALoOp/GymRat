const Exercise = require('../models/Exercise');

// @desc    Get all exercises
// @route   GET /api/v1/exercises
// @access  Private
exports.getExercises = async (req, res, next) => {
    try {
        const exercises = await Exercise.find({ $or: [{ user: req.user.id }, { user: null }] });
        res.status(200).json({ success: true, count: exercises.length, data: exercises });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single exercise
// @route   GET /api/v1/exercises/:id
// @access  Private
exports.getExercise = async (req, res, next) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ success: false, error: 'Exercise not found' });
        }

        res.status(200).json({ success: true, data: exercise });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Create new exercise
// @route   POST /api/v1/exercises
// @access  Private
exports.createExercise = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const exercise = await Exercise.create(req.body);
        res.status(201).json({ success: true, data: exercise });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update exercise
// @route   PUT /api/v1/exercises/:id
// @access  Private
exports.updateExercise = async (req, res, next) => {
    try {
        let exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ success: false, error: 'Exercise not found' });
        }

        // Make sure user is exercise owner
        if (exercise.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this exercise' });
        }

        exercise = await Exercise.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: exercise });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete exercise
// @route   DELETE /api/v1/exercises/:id
// @access  Private
exports.deleteExercise = async (req, res, next) => {
    try {
        const exercise = await Exercise.findById(req.params.id);

        if (!exercise) {
            return res.status(404).json({ success: false, error: 'Exercise not found' });
        }

        // Make sure user is exercise owner
        if (exercise.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this exercise' });
        }

        await exercise.remove();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};