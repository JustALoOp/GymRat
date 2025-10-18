import React, { useState } from 'react';
import {
    TextField, Button, Box, Select, MenuItem, FormControl, InputLabel,
    Alert, Stack
} from '@mui/material';
import type { Exercise } from '../types/exercise';
import type { WorkoutPlanExerciseInput } from '../api/workoutPlans';

interface WorkoutPlanExerciseFormProps {
    onSubmit: (data: WorkoutPlanExerciseInput) => void;
    onCancel: () => void;
    initialData?: WorkoutPlanExerciseInput;
    availableExercises: Exercise[];
}

const WorkoutPlanExerciseForm: React.FC<WorkoutPlanExerciseFormProps> = ({ onSubmit, onCancel, initialData, availableExercises }) => {
    const [formData, setFormData] = useState<WorkoutPlanExerciseInput>(
        initialData || { exercise: '', sets: 3, reps: '8-12' }
    );
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof WorkoutPlanExerciseInput, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.exercise) {
            setError("Proszę wybrać ćwiczenie.");
            return;
        }
        setError(null);
        onSubmit(formData);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                <FormControl fullWidth required>
                    <InputLabel>Ćwiczenie</InputLabel>
                    <Select
                        value={formData.exercise}
                        onChange={(e) => handleChange('exercise', e.target.value)}
                        label="Ćwiczenie"
                    >
                        {availableExercises.map((ex) => (
                            <MenuItem key={ex._id} value={ex._id}>{ex.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Serie"
                    type="number"
                    value={formData.sets}
                    onChange={(e) => handleChange('sets', parseInt(e.target.value, 10))}
                    fullWidth
                    required
                />
                <TextField
                    label="Powtórzenia"
                    value={formData.reps}
                    onChange={(e) => handleChange('reps', e.target.value)}
                    fullWidth
                    required
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                    <Button onClick={onCancel} color="inherit">Anuluj</Button>
                    <Button type="submit" variant="contained">
                        {initialData ? 'Zaktualizuj ćwiczenie' : 'Dodaj ćwiczenie'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default WorkoutPlanExerciseForm;