import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { createWorkout, updateWorkout } from '../api/workouts';

interface Workout {
    _id: string;
    exercise: string;
    reps: number;
    sets: number;
    weight: number;
    createdAt: string;
}

interface WorkoutFormProps {
    onWorkoutAdded: () => void;
    workoutToEdit?: Workout | null;
    onWorkoutUpdated: () => void;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onWorkoutAdded, workoutToEdit, onWorkoutUpdated }) => {
    const [exercise, setExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (workoutToEdit) {
            setExercise(workoutToEdit.exercise);
            setSets(String(workoutToEdit.sets));
            setReps(String(workoutToEdit.reps));
            setWeight(String(workoutToEdit.weight));
            setIsEditMode(true);
        } else {
            setExercise('');
            setSets('');
            setReps('');
            setWeight('');
            setIsEditMode(false);
        }
    }, [workoutToEdit]);

    const resetForm = () => {
        setExercise('');
        setSets('');
        setReps('');
        setWeight('');
        setError(null);
        setIsEditMode(false);
        onWorkoutUpdated(); // To clear the workoutToEdit in parent
    };

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

            if (isEditMode && workoutToEdit) {
                await updateWorkout(workoutToEdit._id, workoutData, token);
                onWorkoutUpdated();
            } else {
                await createWorkout(workoutData, token);
                onWorkoutAdded();
            }
            resetForm();
        } catch (err) {
            setError(isEditMode ? 'Failed to update workout.' : 'Failed to add workout.');
            console.error(err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="h6">{isEditMode ? 'Edit Workout' : 'Add New Workout'}</Typography>
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
            <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? 'Update Workout' : 'Add Workout'}
                </Button>
                {isEditMode && (
                    <Button variant="outlined" color="secondary" onClick={resetForm} sx={{ ml: 2 }}>
                        Cancel Edit
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default WorkoutForm;