import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Typography, CircularProgress, Alert, Box, Grid, Card, CardContent, Snackbar, CardActions, Button, Divider
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';

const SessionCard: React.FC<{ session: IWorkoutSession }> = ({ session }) => {
    const totalVolume = useMemo(() =>
        session.performedExercises.reduce((acc, pEx) =>
            acc + pEx.sets.reduce((setAcc, set) => setAcc + set.weight * set.reps, 0), 0),
        [session.performedExercises]
    );

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {session.workoutPlan?.name || 'Sesja treningowa'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 2 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                        {new Date(session.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <LocalFireDepartmentIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                        {totalVolume.toLocaleString()} kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>- Całkowita objętość</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <FitnessCenterIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
                        {session.performedExercises.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>- Ukończone ćwiczenia</Typography>
                </Box>
            </CardContent>
            <CardActions>
                <Button component={Link} to={`/workouts/${session._id}`} size="small">Zobacz szczegóły</Button>
            </CardActions>
        </Card>
    );
};


const WorkoutsPage: React.FC = () => {
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string }>({ open: false, message: '' });
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSnackbar({ open: true, message: location.state.message });
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        const fetchWorkoutSessions = async () => {
            try {
                setLoading(true);
                const data = await getWorkoutSessions();
                setSessions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch (err) {
                setError('Nie udało się wczytać sesji treningowych.');
            } finally {
                setLoading(false);
            }
        };
        fetchWorkoutSessions();
    }, []);

    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            {!loading && !error && sessions.length === 0 && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">Nie znaleziono historii treningów.</Typography>
                    <Typography color="text.secondary">Ukończ sesję, aby zobaczyć ją tutaj!</Typography>
                </Box>
            )}

            {!loading && sessions.length > 0 && (
                <Grid container spacing={3}>
                    {sessions.map((session) => (
                        <Grid item xs={12} sm={sessions.length > 1 ? 6 : 12} md={sessions.length > 1 ? 6 : 12} lg={sessions.length > 1 ? 4 : 12} key={session._id}>
                            <SessionCard session={session} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                 <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default WorkoutsPage;