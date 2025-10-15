import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, CircularProgress, Paper, Alert, Button, Divider } from '@mui/material';
import { getWorkoutPlan, deleteWorkoutPlan } from '../api/workoutPlans';
import type { IWorkoutPlan } from '../types/workoutPlan';

const WorkoutPlanDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!id || !token) {
            setError('Plan ID or authentication token is missing.');
            setIsLoading(false);
            return;
        }

        const fetchWorkoutPlan = async () => {
            try {
                const plan = await getWorkoutPlan(id, token);
                setWorkoutPlan(plan);
            } catch (err) {
                setError('Failed to fetch workout plan details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkoutPlan();
    }, [id, token]);

    const handleDelete = async () => {
        if (!id || !token) {
            setError('Plan ID or authentication token is missing.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this workout plan?')) {
            try {
                await deleteWorkoutPlan(id, token);
                navigate('/workout-plans');
            } catch (err) {
                setError('Failed to delete workout plan.');
            }
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!workoutPlan) {
        return <Typography>Workout plan not found.</Typography>;
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">{workoutPlan.name}</Typography>
                <Box>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/workouts/active/${workoutPlan._id}`)}
                    >
                        Start Workout
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {workoutPlan.description && <Typography variant="body1" sx={{ mb: 3 }}>{workoutPlan.description}</Typography>}

            <Typography variant="h5" sx={{ mb: 2 }}>Exercises</Typography>
            <Box>
                {workoutPlan.exercises.map(({ exercise, sets, reps }, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6">{exercise.name}</Typography>
                        <Typography>Sets: {sets}</Typography>
                        <Typography>Reps: {reps}</Typography>
                    </Paper>
                ))}
            </Box>
        </Paper>
    );
};

export default WorkoutPlanDetailsPage;