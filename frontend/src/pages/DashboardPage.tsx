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
    Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';
import { useAuth } from '../hooks/useAuth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactElement;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <Card
        sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            background: (theme) => `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
            boxShadow: '0 4px 12px 0 rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: (theme) => `0 8px 20px 0 ${theme.palette.primary.main}33`,
            }
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography
                color="text.secondary"
                sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.8rem' }}
            >
                {title}
            </Typography>
            <Icon sx={{ fontSize: 32, color: 'primary.main', opacity: 0.8 }}>{icon}</Icon>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 1 }}>
            {value}
        </Typography>
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

    if (totalWorkouts === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to GymRat, {user?.name.split(' ')[0] || 'User'}!
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    It looks like you're new here. Let's get you started.
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={5}>
                        <Paper variant="outlined" sx={{ p: 4, '&:hover': { boxShadow: 3 } }}>
                            <AddCircleOutlineIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }}/>
                            <Typography variant="h5" gutterBottom>Create a Workout Plan</Typography>
                            <Typography sx={{ mb: 2 }}>Design your own routine by selecting exercises and setting your goals.</Typography>
                            <Button variant="contained" component={Link} to="/workout-plans/new">Create Plan</Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Paper variant="outlined" sx={{ p: 4, '&:hover': { boxShadow: 3 } }}>
                            <DirectionsRunIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 2 }}/>
                            <Typography variant="h5" gutterBottom>Start Your First Workout</Typography>
                            <Typography sx={{ mb: 2 }}>Jump right in and start tracking your first training session.</Typography>
                            <Button variant="contained" color="secondary" component={Link} to="/workouts/active">Start Session</Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
                Welcome Back, {user?.name.split(' ')[0] || 'User'}!
            </Typography>
            <Grid container spacing={3}>
                {lastSession?.workoutPlan && (
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                p: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: (theme) => `linear-gradient(145deg, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                                color: 'white',
                                boxShadow: '0 4px 12px 0 rgba(0,0,0,0.15)',
                                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: (theme) => `0 8px 20px 0 ${theme.palette.secondary.main}44`,
                                }
                            }}
                        >
                            <Box>
                                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>Continue Your Journey</Typography>
                                <Typography sx={{ opacity: 0.8 }}>Your last session was: <strong>{lastSession.workoutPlan.name}</strong></Typography>
                            </Box>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: 'white',
                                    color: 'secondary.main',
                                    '&:hover': { backgroundColor: 'grey.200' }
                                }}
                                component={Link}
                                to={`/workouts/active/${lastSession.workoutPlan._id}`}
                                endIcon={<ArrowForwardIcon />}
                            >
                                Start Again
                            </Button>
                        </Card>
                    </Grid>
                )}

                <Grid item xs={12} sm={4}><StatCard title="Total Workouts" value={totalWorkouts} icon={<FitnessCenterIcon />} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Total Volume (kg)" value={totalVolume.toLocaleString()} icon={<TrendingUpIcon />} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Last Workout Date" value={lastSession ? new Date(lastSession.date).toLocaleDateString() : 'N/A'} icon={<CalendarTodayIcon />} /></Grid>

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