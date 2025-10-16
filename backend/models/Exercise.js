const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        unique: true,
    },
    type: {
        type: String,
        required: [true, 'Please add an exercise type'],
        enum: ['weight', 'cardio'],
    },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);