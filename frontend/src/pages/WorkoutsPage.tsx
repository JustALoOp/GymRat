import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Container, CircularProgress, Alert } from '@mui/material';
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

    const fetchWorkouts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
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
        fetchWorkouts(); // Refetch workouts after a new one is added
    };

    const handleDeleteWorkout = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                return;
            }
            await deleteWorkout(id, token);
            setWorkouts((prevWorkouts) => prevWorkouts.filter((w) => w._id !== id));
        } catch (err) {
            setError('Failed to delete workout.');
            console.error(err);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Workouts
            </Typography>
            <WorkoutForm onWorkoutAdded={handleWorkoutAdded} />
            {loading ? (
                <CircularProgress sx={{ mt: 3 }} />
            ) : error ? (
                <Alert severity="error" sx={{ mt: 3 }}>
                    {error}
                </Alert>
            ) : (
                <WorkoutList workouts={workouts} onDelete={handleDeleteWorkout} />
            )}
        </Container>
    );
};

export default WorkoutsPage;