const mongoose = require('mongoose');

const WorkoutSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'WorkoutPlan',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number, // in minutes
    },
    exercises: [
        {
            exercise: {
                type: mongoose.Schema.ObjectId,
                ref: 'Exercise',
                required: true,
            },
            sets: [
                {
                    reps: {
                        type: Number,
                        required: true,
                    },
                    weight: {
                        type: Number,
                        required: true,
                    },
                },
            ],
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);