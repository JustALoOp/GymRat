import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    CircularProgress,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExercises = async () => {
            if (!token) {
                setError("Authentication required.");
                setIsLoading(false);
                return;
            }
            try {
                const exercises = await getExercises(token);
                setAvailableExercises(exercises);
            } catch (err) {
                setError('Failed to fetch exercises.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchExercises();
    }, [token]);

    const handleAddExercise = () => {
        setPlanExercises([...planExercises, { exercise: '', sets: 3, reps: '10' }]);
    };

    const handleRemoveExercise = (index: number) => {
        const newExercises = [...planExercises];
        newExercises.splice(index, 1);
        setPlanExercises(newExercises);
    };

    const handleExerciseChange = (index: number, field: keyof WorkoutPlanExerciseInput, value: any) => {
        const newExercises = [...planExercises];
        (newExercises[index] as any)[field] = value;
        setPlanExercises(newExercises);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (planExercises.some(pe => !pe.exercise)) {
            setError("Please select an exercise for all entries.");
            return;
        }
        setError(null);
        onSubmit({ name, description, exercises: planExercises });
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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

            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Exercises</Typography>
            {planExercises.map((planExercise, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                    <FormControl fullWidth sx={{ flex: 3 }}>
                        <InputLabel>Exercise</InputLabel>
                        <Select
                            value={planExercise.exercise}
                            onChange={(e) => handleExerciseChange(index, 'exercise', e.target.value)}
                            label="Exercise"
                        >
                            {availableExercises.map((ex) => (
                                <MenuItem key={ex._id} value={ex._id}>
                                    {ex.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Sets"
                        type="number"
                        value={planExercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value, 10))}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        label="Reps"
                        value={planExercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                        sx={{ flex: 1 }}
                    />
                    <IconButton onClick={() => handleRemoveExercise(index)} color="error">
                        <DeleteIcon />
                    </IconButton>
                </Box>
            ))}

            <Button onClick={handleAddExercise} sx={{ mt: 1 }}>
                Add Exercise
            </Button>

            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button type="submit" variant="contained" color="primary">
                    Save Plan
                </Button>
                <Button variant="outlined" onClick={onCancel}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};

export default WorkoutPlanForm;