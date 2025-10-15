import React, { useState, useEffect } from 'react';
import {
    Typography,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import VolumeChart from '../components/VolumeChart';
import MuscleGroupPieChart from '../components/MuscleGroupPieChart';
import { getUniqueExercises } from '../api/stats';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';

const StatsPage: React.FC = () => {
    const token = localStorage.getItem('token');
    const [exercises, setExercises] = useState<{ _id: string; name: string }[]>([]);
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const [uniqueExercises, allSessions] = await Promise.all([
                        getUniqueExercises(),
                        getWorkoutSessions(),
                    ]);

                    setExercises(uniqueExercises);
                    setSessions(allSessions);

                    if (uniqueExercises.length > 0) {
                        setSelectedExerciseId(uniqueExercises[0]._id);
                    }
                } catch (err) {
                    setError('Failed to fetch dashboard data.');
                } finally {
                    setLoading(false);
                }
            } else {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleExerciseChange = (event: SelectChangeEvent<string>) => {
        setSelectedExerciseId(event.target.value);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Statistics
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" component="h2">
                                Volume History
                            </Typography>
                            <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
                                <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
                                <Select
                                    labelId="exercise-select-label"
                                    value={selectedExerciseId}
                                    label="Select Exercise"
                                    onChange={handleExerciseChange}
                                >
                                    {exercises.map((exercise) => (
                                        <MenuItem key={exercise._id} value={exercise._id}>
                                            {exercise.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {token && selectedExerciseId && sessions.length > 0 ? (
                            <VolumeChart exerciseId={selectedExerciseId} sessions={sessions} />
                        ) : (
                            <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                {exercises.length > 0 ? 'Select an exercise to see the chart.' : 'No workout data available to display charts.'}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                            Total Volume by Muscle Group
                        </Typography>
                        {sessions.length > 0 ? (
                            <MuscleGroupPieChart sessions={sessions} />
                        ) : (
                            <Typography sx={{ mt: 2, textAlign: 'center' }}>
                                No workout data available to display chart.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StatsPage;