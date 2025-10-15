import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Box, CircularProgress, Paper, Alert, Button, Divider, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, IconButton, Fab, Dialog, DialogTitle, DialogContent, Snackbar
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getWorkoutPlan, deleteWorkoutPlan, updateWorkoutPlan, WorkoutPlanExerciseInput } from '../api/workoutPlans';
import { getExercises } from '../api/exercises';
import type { IWorkoutPlan, IWorkoutPlanExercise } from '../types/workoutPlan';
import type { Exercise } from '../types/exercise';
import WorkoutPlanExerciseForm from '../components/WorkoutPlanExerciseForm';

const WorkoutPlanDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlan | null>(null);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState<IWorkoutPlanExercise | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });

    const fetchWorkoutPlan = useCallback(async () => {
        if (!id) {
            setError('Plan ID is missing.');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const [plan, exercises] = await Promise.all([
                getWorkoutPlan(id),
                getExercises()
            ]);
            setWorkoutPlan(plan);
            setAvailableExercises(exercises);
        } catch (err) {
            setError('Failed to fetch page data.');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchWorkoutPlan();
    }, [fetchWorkoutPlan]);

    const handleOpenForm = (exercise?: IWorkoutPlanExercise) => {
        setExerciseToEdit(exercise || null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setExerciseToEdit(null);
    };

    const handleFormSubmit = async (data: WorkoutPlanExerciseInput) => {
        if (!id || !workoutPlan) return;

        let updatedExercises: IWorkoutPlanExercise[];

        if (exerciseToEdit) {
            updatedExercises = workoutPlan.exercises.map(ex =>
                ex.exercise._id === exerciseToEdit.exercise._id ? { ...ex, ...data, exercise: ex.exercise } : ex
            );
        } else {
            const exerciseDetails = availableExercises.find(ex => ex._id === data.exercise);
            if (!exerciseDetails) {
                setSnackbar({ open: true, message: 'Selected exercise not found.', severity: 'error' });
                return;
            }
            const newExercise = { ...data, exercise: exerciseDetails };
            updatedExercises = [...workoutPlan.exercises, newExercise];
        }

        const exercisesToSubmit = updatedExercises.map(ex => ({
            exercise: ex.exercise._id,
            sets: ex.sets,
            reps: ex.reps,
        }));

        try {
            await updateWorkoutPlan(id, { exercises: exercisesToSubmit });
            setSnackbar({ open: true, message: 'Plan updated successfully!', severity: 'success' });
            handleCloseForm();
            fetchWorkoutPlan();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to update plan.', severity: 'error' });
        }
    };

    const handleRemoveExercise = async (exerciseId: string) => {
        if (!id || !workoutPlan || !window.confirm('Are you sure you want to remove this exercise?')) return;

        const updatedExercises = workoutPlan.exercises.filter(ex => ex.exercise._id !== exerciseId);
        const exercisesToSubmit = updatedExercises.map(ex => ({
            exercise: ex.exercise._id,
            sets: ex.sets,
            reps: ex.reps,
        }));

        try {
            await updateWorkoutPlan(id, { exercises: exercisesToSubmit });
            setSnackbar({ open: true, message: 'Exercise removed successfully!', severity: 'success' });
            fetchWorkoutPlan();
        } catch (err) {
            setSnackbar({ open: true, message: 'Failed to remove exercise.', severity: 'error' });
        }
    };

    const handleDeletePlan = async () => {
        if (!id || !window.confirm('Are you sure you want to delete this entire workout plan?')) return;
        try {
            await deleteWorkoutPlan(id);
            navigate('/workout-plans');
        } catch (err) {
            setError('Failed to delete workout plan.');
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!workoutPlan) return <Typography>Workout plan not found.</Typography>;

    return (
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                    <Typography variant="h4" component="h1" gutterBottom>{workoutPlan.name}</Typography>
                    {workoutPlan.description && <Typography variant="body1" color="text.secondary">{workoutPlan.description}</Typography>}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button variant="outlined" color="error" onClick={handleDeletePlan} startIcon={<DeleteIcon />}>
                        Delete Plan
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">Exercises</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
                    Add Exercise
                </Button>
            </Box>

            <List>
                {workoutPlan.exercises.map((planExercise) => (
                    <ListItem key={planExercise.exercise._id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleOpenForm(planExercise)}><EditIcon /></IconButton>
                            <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }} onClick={() => handleRemoveExercise(planExercise.exercise._id)}><DeleteIcon /></IconButton>
                        </>
                    } sx={{ mb: 1, bgcolor: 'background.default', borderRadius: 2, p: 2 }}>
                        <ListItemAvatar><Avatar><FitnessCenterIcon /></Avatar></ListItemAvatar>
                        <ListItemText primary={planExercise.exercise.name} secondary={`Sets: ${planExercise.sets} | Reps: ${planExercise.reps}`} />
                    </ListItem>
                ))}
            </List>

            {workoutPlan.exercises.length === 0 && (
                <Typography sx={{ textAlign: 'center', my: 4 }} color="text.secondary">
                    This plan has no exercises yet. Add one to get started!
                </Typography>
            )}

            <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{exerciseToEdit ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
                <DialogContent>
                    <WorkoutPlanExerciseForm
                        onSubmit={handleFormSubmit}
                        onCancel={handleCloseForm}
                        initialData={exerciseToEdit ? { exercise: exerciseToEdit.exercise._id, sets: exerciseToEdit.sets, reps: exerciseToEdit.reps } : undefined}
                        availableExercises={availableExercises}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            <Fab color="primary" variant="extended" aria-label="start workout" sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => navigate(`/workouts/active/${workoutPlan._id}`)}>
                <PlayArrowIcon sx={{ mr: 1 }} />
                Start Workout
            </Fab>
        </Paper>
    );
};

export default WorkoutPlanDetailsPage;