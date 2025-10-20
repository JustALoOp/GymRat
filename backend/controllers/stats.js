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

// @desc    Get overall stats for the user
// @route   GET /api/v1/stats/overall
// @access  Private
exports.getOverallStats = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const stats = await WorkoutSession.aggregate([
            { $match: { user: userId } },
            {
                $facet: {
                    "totalSessions": [
                        { $count: "count" }
                    ],
                    "totalVolume": [
                        { $unwind: "$performedExercises" },
                        { $unwind: "$performedExercises.sets" },
                        { $group: {
                            _id: null,
                            total: {
                                $sum: { $multiply: ["$performedExercises.sets.reps", "$performedExercises.sets.weight"] }
                            }
                        }}
                    ],
                    "weeklyVolume": [
                        { $unwind: "$performedExercises" },
                        { $unwind: "$performedExercises.sets" },
                        { $group: {
                            _id: { $week: "$date" },
                            totalVolume: {
                                $sum: { $multiply: ["$performedExercises.sets.reps", "$performedExercises.sets.weight"] }
                            },
                            date: { $first: "$date" }
                        }},
                        { $sort: { "_id": 1 } },
                        {
                            $project: {
                                _id: 0,
                                week: {
                                    $dateToString: {
                                        format: "%Y-%U",
                                        date: "$date"
                                    }
                                },
                                volume: "$totalVolume"
                            }
                        }
                    ]
                }
            }
        ]);

        const result = {
            totalSessions: stats[0].totalSessions[0]?.count || 0,
            totalVolume: stats[0].totalVolume[0]?.total || 0,
            weeklyVolume: stats[0].weeklyVolume,
        };

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get unique exercises performed by the user
// @route   GET /api/v1/stats/unique-exercises
// @access  Private
exports.getUniqueExercises = async (req, res, next) => {
    try {
        const uniqueExercises = await WorkoutSession.aggregate([
            // Match sessions for the logged-in user
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },

            // Unwind the exercises array to deconstruct the exercises array field from the input documents to output a document for each element
            { $unwind: '$exercises' },

            // Group by exercise ID to get unique exercises
            { $group: { _id: '$exercises.exercise' } },

            // Lookup exercise details from the 'exercises' collection
            {
                $lookup: {
                    from: 'exercises', // The collection to join with
                    localField: '_id', // Field from the input documents
                    foreignField: '_id', // Field from the documents of the "from" collection
                    as: 'exerciseDetails' // Output array field name
                }
            },

            // Unwind the resulting array from the lookup
            { $unwind: '$exerciseDetails' },

            // Project to shape the output
            {
                $project: {
                    _id: '$_id',
                    name: '$exerciseDetails.name'
                }
            },

            // Sort by name
            { $sort: { name: 1 } }
        ]);

        res.status(200).json({ success: true, data: uniqueExercises });

    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};