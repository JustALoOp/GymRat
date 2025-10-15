import React, { useState, useEffect } from 'react';
import {
    TextField, Button, Box, Typography, IconButton, Select, MenuItem, FormControl,
    InputLabel, CircularProgress, Alert, Stack, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { getExercises } from '../api/exercises';
import type { Exercise } from '../types/exercise';
import type { WorkoutPlanInput, WorkoutPlanExerciseInput } from '../api/workoutPlans';

interface WorkoutPlanFormProps {
    onSubmit: (data: WorkoutPlanInput) => void;
    initialData?: WorkoutPlanInput;
    onCancel: () => void;
}

const WorkoutPlanForm: React.FC<WorkoutPlanFormProps> = ({ onSubmit, initialData, onCancel }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [planExercises, setPlanExercises] = useState<WorkoutPlanExerciseInput[]>(initialData?.exercises || []);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const exercises = await getExercises();
                setAvailableExercises(exercises);
            } catch (err) {
                setError('Failed to fetch exercises.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchExercises();
    }, []);

    const handleAddExercise = () => {
        setPlanExercises([...planExercises, { exercise: '', sets: 3, reps: '8-12' }]);
    };

    const handleRemoveExercise = (index: number) => {
        setPlanExercises(planExercises.filter((_, i) => i !== index));
    };

    const handleExerciseChange = (index: number, field: keyof WorkoutPlanExerciseInput, value: any) => {
        const newExercises = planExercises.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setPlanExercises(newExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Plan name is required.");
            return;
        }
        if (planExercises.some(pe => !pe.exercise)) {
            setError("Please select an exercise for all entries or remove empty ones.");
            return;
        }
        setError(null);
        onSubmit({ name, description, exercises: planExercises });
    };

    if (isLoading) return <CircularProgress />;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
                {error && <Alert severity="error">{error}</Alert>}
                <TextField
                    label="Plan Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                />
                <TextField
                    label="Description (Optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                />
                <Divider />
                <Typography variant="h6">Exercises</Typography>
                <Stack spacing={2}>
                    {planExercises.map((planExercise, index) => (
                        <Stack direction="row" key={index} spacing={1.5} alignItems="center">
                            <FormControl fullWidth sx={{ flex: 4 }}>
                                <InputLabel>Exercise</InputLabel>
                                <Select value={planExercise.exercise} onChange={(e) => handleExerciseChange(index, 'exercise', e.target.value)} label="Exercise" required>
                                    {availableExercises.map((ex) => <MenuItem key={ex._id} value={ex._id}>{ex.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <TextField label="Sets" type="number" value={planExercise.sets} onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value, 10))} sx={{ flex: 1 }} />
                            <TextField label="Reps" value={planExercise.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} sx={{ flex: 1.5 }} />
                            <IconButton onClick={() => handleRemoveExercise(index)} color="inherit"><DeleteIcon /></IconButton>
                        </Stack>
                    ))}
                </Stack>
                <Button onClick={handleAddExercise} startIcon={<AddCircleOutlineIcon />} sx={{ alignSelf: 'flex-start' }}>
                    Add Exercise
                </Button>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                    <Button onClick={onCancel} color="inherit">Cancel</Button>
                    <Button type="submit" variant="contained">Save Plan</Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default WorkoutPlanForm;