import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography,
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
import { getWorkoutSessions } from '../api/workoutSessions';
import type { IWorkoutSession } from '../types/workoutSession';

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
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [selectedExerciseName, setSelectedExerciseName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const [uniqueExercises, allSessions] = await Promise.all([
                        getUniqueExercises(token),
                        getWorkoutSessions(token),
                    ]);

                    setExercises(uniqueExercises);
                    setSessions(allSessions);

                    if (uniqueExercises.length > 0) {
                        setSelectedExerciseId(uniqueExercises[0]._id);
                        setSelectedExerciseName(uniqueExercises[0].name);
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
        const exerciseId = event.target.value;
        setSelectedExerciseId(exerciseId);
        const exercise = exercises.find((ex) => ex._id === exerciseId);
        if (exercise) {
            setSelectedExerciseName(exercise.name);
        }
    };

    const lastWorkoutDate = useMemo(() => {
        if (sessions.length === 0) return null;
        return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
    }, [sessions]);

    const personalBest = useMemo(() => {
        if (!selectedExerciseId || sessions.length === 0) return { weight: 0, reps: 0 };

        let maxWeight = 0;
        let repsForMaxWeight = 0;

        sessions.forEach(session => {
            session.performedExercises.forEach(pEx => {
                if (pEx.exercise._id === selectedExerciseId) {
                    pEx.sets.forEach(set => {
                        if (set.weight > maxWeight) {
                            maxWeight = set.weight;
                            repsForMaxWeight = set.reps;
                        }
                    });
                }
            });
        });

        return { weight: maxWeight, reps: repsForMaxWeight };
    }, [sessions, selectedExerciseId]);

    const totalVolume = useMemo(() => {
        return sessions.reduce((total, session) => {
            return total + session.performedExercises.reduce((sessionTotal, pEx) => {
                return sessionTotal + pEx.sets.reduce((exTotal, set) => {
                    return exTotal + (set.weight * set.reps);
                }, 0);
            }, 0);
        }, 0);
    }, [sessions]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <StatCard title="Total Volume (kg)" value={totalVolume.toLocaleString()} loading={loading} />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <StatCard
                            title="Last Workout"
                            value={lastWorkoutDate ? new Date(lastWorkoutDate).toLocaleDateString() : 'N/A'}
                            loading={loading}
                        />
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
                        <StatCard
                            title={`Personal Best (${selectedExerciseName || '...'})`}
                            value={`${personalBest.weight} kg x ${personalBest.reps} reps`}
                            loading={loading && !!selectedExerciseId}
                        />
                    </Paper>
                </Grid>

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
            </Grid>
        </Box>
    );
};

export default DashboardPage;