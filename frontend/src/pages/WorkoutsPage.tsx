import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    Paper,
} from '@mui/material';
import WorkoutList from '../components/WorkoutList';
import WorkoutForm from '../components/WorkoutForm';
import { getWorkouts, deleteWorkout } from '../api/workouts';

interface Workout {
    _id: string;
    exercise: string;
    reps: number;
    sets: number;
    weight: number;
    createdAt: string;
}

const WorkoutsPage: React.FC = () => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [workoutToEdit, setWorkoutToEdit] = useState<Workout | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [workoutToDelete, setWorkoutToDelete] = useState<string | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const fetchWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }
            const data = await getWorkouts(token);
            setWorkouts(data);
        } catch (err) {
            setError('Failed to fetch workouts.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts]);

    const handleWorkoutAdded = () => {
        fetchWorkouts();
        setFormOpen(false);
    };

    const handleWorkoutUpdated = () => {
        setWorkoutToEdit(null);
        fetchWorkouts();
        setFormOpen(false);
    };

    const handleEditWorkout = (workout: Workout) => {
        setWorkoutToEdit(workout);
        setFormOpen(true);
    };

    const handleOpenForm = () => {
        setWorkoutToEdit(null);
        setFormOpen(true);
    };

    const handleCloseForm = () => {
        setWorkoutToEdit(null);
        setFormOpen(false);
    };

    const handleDeleteRequest = (id: string) => {
        setWorkoutToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setWorkoutToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (workoutToDelete) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    return;
                }
                await deleteWorkout(workoutToDelete, token);
                setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w._id !== workoutToDelete));
            } catch (err) {
                setError('Failed to delete workout.');
                console.error(err);
            } finally {
                handleCloseDeleteDialog();
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Your Workouts
                </Typography>
                <Button variant="contained" color="primary" onClick={handleOpenForm}>
                    Add New Workout
                </Button>
            </Box>

            <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{workoutToEdit ? 'Edit Workout' : 'Add New Workout'}</DialogTitle>
                <DialogContent>
                    <WorkoutForm
                        onWorkoutAdded={handleWorkoutAdded}
                        workoutToEdit={workoutToEdit}
                        onWorkoutUpdated={handleWorkoutUpdated}
                        onCancel={handleCloseForm}
                    />
                </DialogContent>
            </Dialog>

            <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">
                        {error}
                    </Alert>
                ) : (
                    <WorkoutList
                        workouts={workouts}
                        onDelete={handleDeleteRequest}
                        onEdit={handleEditWorkout}
                    />
                )}
            </Paper>

            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this workout? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkoutsPage;