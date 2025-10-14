import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { createWorkout } from '../api/workouts';

interface WorkoutFormProps {
    onWorkoutAdded: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onWorkoutAdded }) => {
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found. Please log in.');
                return;
            }
            const workoutData = {
                exercise,
                sets: parseInt(sets),
                reps: parseInt(reps),
                weight: parseFloat(weight),
            };
            await createWorkout(workoutData, token);
            onWorkoutAdded(); // Callback to refresh the list
            // Reset form
            setExercise('');
            setSets('');
            setReps('');
            setWeight('');
        } catch (err) {
            setError('Failed to add workout.');
            console.error(err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Typography variant="h6">Add New Workout</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
                label="Exercise"
                variant="outlined"
                fullWidth
                margin="normal"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                required
            />
            <TextField
                label="Sets"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
                required
            />
            <TextField
                label="Reps"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                required
            />
            <TextField
                label="Weight (kg)"
                variant="outlined"
                type="number"
                fullWidth
                margin="normal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Workout
            </Button>
        </Box>
    );
};

export default WorkoutForm;