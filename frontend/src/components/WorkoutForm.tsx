import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, Autocomplete } from '@mui/material';
import { createWorkout, updateWorkout } from '../api/workouts';
import { getUniqueExercises } from '../api/stats';

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
    onCancel: () => void;
}

interface ExerciseOption {
    _id: string;
    name: string;
}

const WorkoutForm: React.FC<WorkoutFormProps> = ({ onWorkoutAdded, workoutToEdit, onWorkoutUpdated, onCancel }) => {
    const [exercise, setExercise] = useState('');
    const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const uniqueExercises: ExerciseOption[] = await getUniqueExercises(token);
                    setExerciseOptions(uniqueExercises.map(ex => ex.name));
                }
            } catch (err) {
                console.error("Failed to fetch exercise options:", err);
            }
        };

        fetchExercises();

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

    const resetForm = (clearParentState = true) => {
        setExercise('');
        setSets('');
        setReps('');
        setWeight('');
        setError(null);
        setIsEditMode(false);
        if (clearParentState) {
            onWorkoutUpdated(); // To clear the workoutToEdit in parent
        }
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
            resetForm(false); // Reset local form state, but parent will close modal
        } catch (err) {
            setError(isEditMode ? 'Failed to update workout.' : 'Failed to add workout.');
            console.error(err);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Autocomplete
                freeSolo
                options={exerciseOptions}
                value={exercise}
                onChange={(_, newValue) => {
                    setExercise(newValue || '');
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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={onCancel} color="secondary" sx={{ mr: 1 }}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                    {isEditMode ? 'Update Workout' : 'Add Workout'}
                </Button>
            </Box>
        </Box>
    );
};

export default WorkoutForm;