import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Typography,
    CircularProgress,
    Alert,
    Box,
    Grid,
    Card,
    CardContent,
    Snackbar,
} from '@mui/material';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';

const WorkoutsPage: React.FC = () => {
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSnackbar({ open: true, message: location.state.message });
            // Clear the state so the message doesn't reappear on refresh
            window.history.replaceState({}, document.title)
        }
    }, [location]);

    const fetchWorkoutSessions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getWorkoutSessions();
            setSessions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())); // Sort by most recent
        } catch (err) {
            setError('Failed to fetch workout sessions.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkoutSessions();
    }, [fetchWorkoutSessions]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Workout History
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            ) : sessions.length === 0 ? (
                <Typography sx={{ mt: 3 }}>
                    You haven't completed any workouts yet. Go start one!
                </Typography>
            ) : (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    {sessions.map((session) => (
                        <Grid item xs={12} md={6} lg={4} key={session._id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {session.workoutPlan?.name || 'Workout Session'}
                                    </Typography>
                                    <Typography color="text.secondary" sx={{ mb: 1.5 }}>
                                        {new Date(session.date).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </Typography>
                                    <Typography variant="body2">
                                        {session.performedExercises.length} exercise(s) completed.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default WorkoutsPage;