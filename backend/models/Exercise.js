const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    muscleGroup: {
        type: String,
        required: [true, 'Please add a muscle group'],
        enum: [
            'Chest',
            'Back',
            'Legs',
            'Shoulders',
            'Biceps',
            'Triceps',
            'Abs',
            'Other',
        ],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false,
    },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);