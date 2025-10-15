import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getWorkoutSessions } from '../api/workouts';
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
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (token) {
                try {
                    setLoading(true);
                    const allSessions = await getWorkoutSessions();
                    setSessions(allSessions);
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

    const lastWorkoutDate = useMemo(() => {
        if (sessions.length === 0) return null;
        return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
    }, [sessions]);

    const totalVolume = useMemo(() => {
        return sessions.reduce((total, session) => {
            return total + session.performedExercises.reduce((sessionTotal, pEx) => {
                return sessionTotal + pEx.sets.reduce((exTotal, set) => {
                    return exTotal + (set.weight * set.reps);
                }, 0);
            }, 0);
        }, 0);
    }, [sessions]);

    const totalWorkouts = useMemo(() => sessions.length, [sessions]);

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
                        <StatCard title="Total Workouts" value={totalWorkouts} loading={loading} />
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Explore Your Progress
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Dive deeper into your performance metrics and track your gains over time.
                        </Typography>
                        <Button variant="contained" color="primary" component={Link} to="/stats" size="large">
                            View Detailed Statistics
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;