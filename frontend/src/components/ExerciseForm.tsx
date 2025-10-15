import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Stack, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { Exercise } from '../types/exercise';
import { createExercise, updateExercise, ExerciseInput } from '../api/exercises';

const muscleGroupOptions = ["Chest", "Back", "Legs", "Shoulders", "Biceps", "Triceps", "Abs", "Other"];

interface ExerciseFormProps {
    onSuccess: (message: string) => void;
    onCancel: () => void;
    exerciseToEdit?: Exercise | null;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSuccess, onCancel, exerciseToEdit }) => {
    const [name, setName] = useState('');
    const [muscleGroup, setMuscleGroup] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (exerciseToEdit) {
            setName(exerciseToEdit.name);
            setMuscleGroup(exerciseToEdit.muscleGroup);
        } else {
            setName('');
            setMuscleGroup('');
        }
    }, [exerciseToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !muscleGroup) {
            setError('All fields are required.');
            return;
        }

        const exerciseData: ExerciseInput = { name, muscleGroup };

        try {
            if (exerciseToEdit) {
                await updateExercise(exerciseToEdit._id, exerciseData);
                onSuccess('Exercise updated successfully!');
            } else {
                await createExercise(exerciseData);
                onSuccess('Exercise created successfully!');
            }
        } catch (err) {
            setError('Failed to save the exercise. Please try again.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Exercise Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                />
                <FormControl fullWidth required>
                    <InputLabel>Muscle Group</InputLabel>
                    <Select
                        value={muscleGroup}
                        label="Muscle Group"
                        onChange={(e) => setMuscleGroup(e.target.value)}
                    >
                        {muscleGroupOptions.map(group => <MenuItem key={group} value={group}>{group}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                    <Button onClick={onCancel} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained">
                        {exerciseToEdit ? 'Update Exercise' : 'Create Exercise'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default ExerciseForm;