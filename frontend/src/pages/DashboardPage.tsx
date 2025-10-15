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
import { useAuth } from '../hooks/useAuth';
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
    const { user, loading: userLoading } = useAuth();
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const allSessions = await getWorkoutSessions();
                setSessions(allSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (err) {
                setError('Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const lastSession = useMemo(() => sessions[0], [sessions]);

    const totalVolume = useMemo(() => sessions.reduce((total, session) => total + session.performedExercises.reduce((sessionTotal, pEx) => sessionTotal + pEx.sets.reduce((exTotal, set) => exTotal + (set.weight * set.reps), 0), 0), 0), [sessions]);
    const totalWorkouts = useMemo(() => sessions.length, [sessions]);

    const isLoading = loading || userLoading;

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Welcome Back, {user?.name.split(' ')[0] || 'User'}!
            </Typography>
            <Grid container spacing={3}>
                {/* Quick Start Card */}
                {lastSession?.workoutPlan && (
                    <Grid item xs={12}>
                        <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'primary.dark' }}>
                            <Box>
                                <Typography variant="h6">Continue where you left off?</Typography>
                                <Typography color="text.secondary">Last workout: {lastSession.workoutPlan.name}</Typography>
                            </Box>
                            <Button variant="contained" color="secondary" component={Link} to={`/workouts/active/${lastSession.workoutPlan._id}`} endIcon={<ArrowForwardIcon />}>
                                Start Again
                            </Button>
                        </Card>
                    </Grid>
                )}

                {/* General Stats */}
                <Grid item xs={12} sm={4}><StatCard title="Total Workouts" value={totalWorkouts} icon={<FitnessCenterIcon />} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Total Volume (kg)" value={totalVolume.toLocaleString()} icon={<TrendingUpIcon />} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Last Workout Date" value={lastSession ? new Date(lastSession.date).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} /></Grid>

                {/* Last Workout Summary */}
                {lastSession && (
                     <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Last Workout Summary: {lastSession.workoutPlan?.name || 'Session'}</Typography>
                                <Grid container spacing={2}>
                                    {lastSession.performedExercises.slice(0, 3).map(pEx => (
                                        <Grid item xs={12} sm={4} key={pEx.exercise._id}>
                                            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                                                <Typography variant="subtitle1" component="div">{pEx.exercise.name}</Typography>
                                                <Typography color="text.secondary">{pEx.sets.length} sets</Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box sx={{textAlign: 'right', mt: 2}}>
                                    <Button component={Link} to={`/workouts/${lastSession._id}`} size="small">View Full Details</Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardPage;