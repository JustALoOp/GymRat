import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography, Box, CircularProgress, Paper, Alert, Grid, Card, CardContent, Divider, List, ListItem, ListItemText, Avatar, ListItemAvatar
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import NotesIcon from '@mui/icons-material/Notes';
import ScaleIcon from '@mui/icons-material/Scale';
import RepeatIcon from '@mui/icons-material/Repeat';
import { getWorkoutSession } from '../api/workouts';
import type { IWorkoutSession, PerformedExercise } from '../types/workoutSession';

const PerformedExerciseCard: React.FC<{ performedExercise: PerformedExercise }> = ({ performedExercise }) => {
    const totalVolume = useMemo(() =>
        performedExercise.sets.reduce((acc, set) => acc + (set.weight * set.reps), 0),
        [performedExercise.sets]
    );

    return (
        <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
            <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                    {performedExercise.exercise.name}
                </Typography>
                <List dense>
                    {performedExercise.sets.map((set, index) => (
                        <ListItem key={index} disableGutters>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.dark' }}>
                                    <Typography variant="caption">{index + 1}</Typography>
                                </Avatar>
                            </ListItemAvatar>
                            <Grid container spacing={2}>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScaleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <ListItemText primary={`${set.weight} kg`} />
                                </Grid>
                                <Grid item xs={4} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <RepeatIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                    <ListItemText primary={`${set.reps} powtórzeń`} />
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                     <LocalFireDepartmentIcon fontSize="small" sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {totalVolume.toLocaleString()} kg
                    </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>- Całkowita objętość</Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

const WorkoutDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<IWorkoutSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWorkoutSession = async () => {
            if (!id) {
                setError('Brak ID sesji.');
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                const data = await getWorkoutSession(id);
                setSession(data);
            } catch (err) {
                setError('Nie udało się wczytać danych sesji.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkoutSession();
    }, [id]);

    const totalSessionVolume = useMemo(() =>
        session?.performedExercises.reduce((acc, pEx) =>
            acc + pEx.sets.reduce((setAcc, set) => setAcc + set.weight * set.reps, 0), 0) || 0,
        [session?.performedExercises]
    );

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!session) return <Typography>Nie znaleziono sesji treningowej.</Typography>;

    return (
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {session.workoutPlan?.name || 'Szczegóły sesji treningowej'}
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ mr: 1.5, color: 'text.secondary' }} />
                    <Box>
                        <Typography variant="body1">
                            {new Date(session.date).toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Data treningu</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalFireDepartmentIcon sx={{ mr: 1.5, color: 'warning.main' }} />
                    <Box>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{totalSessionVolume.toLocaleString()} kg</Typography>
                        <Typography variant="caption" color="text.secondary">Całkowita objętość</Typography>
                    </Box>
                </Grid>
            </Grid>

            {session.notes && (
                 <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3, p:2, bgcolor: 'background.default', borderRadius: 2 }}>
                    <NotesIcon sx={{ mr: 1.5, mt: 0.5, color: 'text.secondary' }} />
                    <Box>
                        <Typography variant="h6" component="h2">Notatki</Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>{session.notes}</Typography>
                    </Box>
                </Box>
            )}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
                Wykonane ćwiczenia ({session.performedExercises.length})
            </Typography>

            {session.performedExercises.map(pExercise => (
                <PerformedExerciseCard key={pExercise._id} performedExercise={pExercise} />
            ))}

        </Paper>
    );
};

export default WorkoutDetailsPage;