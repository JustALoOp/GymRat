import React, { useState, useEffect } from 'react';
import { TextField, Button, Box } from '@mui/material';
import type { Exercise } from '../types/exercise';
import { createExercise, updateExercise } from '../api/exercises';
import type { ExerciseInput } from '../api/exercises';

interface ExerciseFormProps {
    onSuccess: (message: string) => void;
    onCancel: () => void;
    exerciseToEdit?: Exercise | null;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ onSuccess, onCancel, exerciseToEdit }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (exerciseToEdit) {
            setName(exerciseToEdit.name);
        } else {
            setName('');
        }
    }, [exerciseToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Exercise name is required.');
            return;
        }

        if (!token) {
            setError('Authentication token not found. Please log in.');
            return;
        }

        const exerciseData: ExerciseInput = { name };

        try {
            if (exerciseToEdit) {
                await updateExercise(exerciseToEdit._id, exerciseData, token);
                onSuccess('Exercise updated successfully!');
            } else {
                await createExercise(exerciseData, token);
                onSuccess('Exercise created successfully!');
            }
        } catch (err) {
            setError('Failed to save the exercise. Please try again.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="Exercise Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!error}
                    helperText={error}
                    fullWidth
                    required
                />
                <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button onClick={onCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {exerciseToEdit ? 'Update' : 'Create'}
                    </Button>
                </Box>
            </Box>
        </form>
    );
};

export default ExerciseForm;