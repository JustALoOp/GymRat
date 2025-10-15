import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    CircularProgress,
    Alert,
    Button,
    Icon,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Definicja typu dla karty statystyk
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactElement;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, loading }) => (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
        <Icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }}>{icon}</Icon>
        <Box>
            <Typography variant="h5" component="div">
                {loading ? <CircularProgress size={24} /> : value}
            </Typography>
            <Typography color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
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
        if (sessions.length === 0) return 'N/A';
        const lastSession = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return new Date(lastSession.date).toLocaleDateString();
    }, [sessions]);

    const totalVolume = useMemo(() => {
        return sessions.reduce((total, session) =>
            total + session.performedExercises.reduce((sessionTotal, pEx) =>
                sessionTotal + pEx.sets.reduce((exTotal, set) => exTotal + (set.weight * set.reps), 0), 0), 0);
    }, [sessions]);

    const totalWorkouts = useMemo(() => sessions.length, [sessions]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Welcome Back!
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Volume (kg)"
                        value={totalVolume.toLocaleString()}
                        icon={<TrendingUpIcon />}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Last Workout"
                        value={lastWorkoutDate}
                        icon={<CalendarTodayIcon />}
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard
                        title="Total Workouts"
                        value={totalWorkouts}
                        icon={<FitnessCenterIcon />}
                        loading={loading}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Card
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'background.paper',
                        }}
                    >
                        <Box>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Explore Your Progress
                            </Typography>
                            <Typography color="text.secondary">
                                Dive deeper into your performance metrics and track your gains.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            to="/stats"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            sx={{ mt: { xs: 2, md: 0 } }}
                        >
                            View Statistics
                        </Button>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DashboardPage;