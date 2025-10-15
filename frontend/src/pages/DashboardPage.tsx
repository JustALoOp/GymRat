import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography,
    Container,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Alert,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import VolumeChart from '../components/VolumeChart';
import { getUniqueExercises } from '../api/stats';
import { getWorkouts } from '../api/workouts';
import type { Workout } from '../types/workout';

const StatCard: React.FC<{ title: string; value: string | number; loading?: boolean }> = ({ title, value, loading }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h4" component="div">
                {loading ? <CircularProgress size={24} /> : value}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage: React.FC = () => {
    const token = localStorage.getItem('token');
    const [exercises, setExercises] = useState<{ _id: string; name: string }[]>([]);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [selectedExerciseName, setSelectedExerciseName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const [uniqueExercises, allWorkouts] = await Promise.all([
                        getUniqueExercises(token),
                        getWorkouts(token),
                    ]);

                    setExercises(uniqueExercises);
                    setWorkouts(allWorkouts);

                    if (uniqueExercises.length > 0) {
                        setSelectedExerciseId(uniqueExercises[0]._id);
                        setSelectedExerciseName(uniqueExercises[0].name);
                    }
                } catch (err) {
                    setError('Failed to fetch dashboard data.');
                    console.error(err);
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
        const exerciseId = event.target.value;
        setSelectedExerciseId(exerciseId);
        const exercise = exercises.find((ex) => ex._id === exerciseId);
        if (exercise) {
            setSelectedExerciseName(exercise.name);
        }
    };

    const lastWorkout = useMemo(() => {
        if (workouts.length === 0) return null;
        return workouts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    }, [workouts]);

    const personalBest = useMemo(() => {
        if (!selectedExerciseId) return { weight: 0, reps: 0 };

        const exerciseWorkouts = workouts.filter(w => w.exercise === selectedExerciseId);
        if (exerciseWorkouts.length === 0) return { weight: 0, reps: 0 };

        return exerciseWorkouts.reduce(
            (max, w) => {
                if (w.weight > max.weight) {
                    return { weight: w.weight, reps: w.reps };
                }
                return max;
            },
            { weight: 0, reps: 0 }
        );
    }, [workouts, selectedExerciseId]);

    const totalVolume = useMemo(() => {
        return workouts.reduce((acc, w) => acc + w.weight * w.sets * w.reps, 0);
    }, [workouts]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Dashboard
            </Typography>
            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard title="Total Volume (kg)" value={totalVolume.toLocaleString()} loading={loading} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Last Workout"
                        value={lastWorkout ? new Date(lastWorkout.createdAt).toLocaleDateString() : 'N/A'}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title={`Personal Best (${selectedExerciseName || '...'})`}
                        value={`${personalBest.weight} kg x ${personalBest.reps} reps`}
                        loading={loading && !!selectedExerciseId}
                    />
                </Grid>

                {/* Volume Chart */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" component="h2">
                                Volume History
                            </Typography>
                            <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                        {token && selectedExerciseId ? (
                            <VolumeChart exerciseId={selectedExerciseId} token={token} />
                        ) : (
                            <Typography sx={{ mt: 2 }}>
                                {exercises.length > 0 ? 'Select an exercise to see the chart.' : 'No workout data available to display charts.'}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
};

export default DashboardPage;