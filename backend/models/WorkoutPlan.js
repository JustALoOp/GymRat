const mongoose = require('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    exercises: [
        {
            exercise: {
                type: mongoose.Schema.ObjectId,
                ref: 'Exercise',
                required: true,
            },
            sets: {
                type: Number,
                required: true,
            },
            reps: {
                type: String, // e.g., "8-12"
                required: true,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('WorkoutPlan', WorkoutPlanSchema);