import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Container,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
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
    };

    const handleWorkoutUpdated = () => {
        setWorkoutToEdit(null);
        fetchWorkouts();
    };

    const handleEditWorkout = (workout: Workout) => {
        setWorkoutToEdit(workout);
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
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Workouts
            </Typography>
            <WorkoutForm
                onWorkoutAdded={handleWorkoutAdded}
                workoutToEdit={workoutToEdit}
                onWorkoutUpdated={handleWorkoutUpdated}
            />
            {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : error ? (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            ) : (
                <WorkoutList
                    workouts={workouts}
                    onDelete={handleDeleteRequest}
                    onEdit={handleEditWorkout}
                />
            )}
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
        </Container>
    );
};

export default WorkoutsPage;