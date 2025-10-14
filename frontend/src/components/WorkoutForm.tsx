import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert, Autocomplete } from '@mui/material';
import { createWorkout } from '../api/workouts';
import { getUniqueExercises } from '../api/stats';

interface WorkoutFormProps {
    onWorkoutAdded: () => void;
}

interface ExerciseOption {
    label: string;
    _id: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onWorkoutAdded }) => {
    const [exercise, setExercise] = useState<string | null>(null);
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [exerciseOptions, setExerciseOptions] = useState<ExerciseOption[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const uniqueExercises = await getUniqueExercises(token);
                    const options = uniqueExercises.map((ex: { name: string; _id: string }) => ({
                        label: ex.name,
                        _id: ex._id,
                    }));
                    setExerciseOptions(options);
                } catch (error) {
                    console.error('Error fetching unique exercises:', error);
                }
            }
        };

        fetchExercises();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!exercise) {
            setError('Please select or enter an exercise.');
            return;
        }

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
            setExercise(null);
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
            <Autocomplete
                freeSolo
                options={exerciseOptions.map((option) => option.label)}
                value={exercise}
                onChange={(_, newValue) => {
                    setExercise(newValue);
                }}
                onInputChange={(_, newInputValue) => {
                    setExercise(newInputValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Exercise"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                    />
                )}
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