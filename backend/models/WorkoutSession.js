const mongoose = require('mongoose');

const PerformedSetSchema = new mongoose.Schema({
    weight: {
        type: Number,
        required: true,
    },
    reps: {
        type: Number,
        required: true,
    },
    completed: {
        type:Boolean,
        default: true
    }
}, { _id: false });

const PerformedExerciseSchema = new mongoose.Schema({
    exercise: {
        type: mongoose.Schema.ObjectId,
        ref: 'Exercise',
        required: true,
    },
    sets: [PerformedSetSchema],
}, { _id: false });

const WorkoutSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    workoutPlan: {
        type: mongoose.Schema.ObjectId,
        ref: 'WorkoutPlan',
        required: true,
    },
    performedExercises: [PerformedExerciseSchema],
    date: {
        type: Date,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
    }
});

module.exports = mongoose.model('WorkoutSession', WorkoutSessionSchema);