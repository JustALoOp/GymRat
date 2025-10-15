import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import type { WorkoutPlanInput } from '../api/workoutPlans';

interface WorkoutPlanFormProps {
    onSubmit: (data: WorkoutPlanInput) => void;
    initialData?: WorkoutPlanInput;
}

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, description, exercises: [] });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                label="Plan Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                margin="normal"
                multiline
            />
            <Button type="submit" variant="contained" color="primary">
                Save Plan
            </Button>
        </Box>
    );
};

export default WorkoutPlanForm;