const WorkoutSession = require('../models/WorkoutSession');
const mongoose = require('mongoose');

// @desc    Get volume history for a specific exercise
// @route   GET /api/v1/stats/volume-history/:exerciseId
// @access  Private
exports.getVolumeHistory = async (req, res, next) => {
    try {
        const { exerciseId } = req.params;

        const volumeHistory = await WorkoutSession.aggregate([
            // Match sessions for the logged-in user
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },

            // Unwind the exercises array
            { $unwind: '$exercises' },

            // Match the specific exercise
            { $match: { 'exercises.exercise': new mongoose.Types.ObjectId(exerciseId) } },

            // Unwind the sets array
            { $unwind: '$exercises.sets' },

            // Group by date and calculate total volume for that day
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalVolume: {
                        $sum: { $multiply: ['$exercises.sets.reps', '$exercises.sets.weight'] }
                    }
                }
            },

            // Sort by date
            { $sort: { _id: 1 } },

            // Rename _id to date for clarity
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    volume: '$totalVolume'
                }
            }
        ]);

        res.status(200).json({ success: true, data: volumeHistory });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};