import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    Paper,
    Container,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent
} from '@mui/material';
import { getExercises, createExercise } from '../api/exercises';
import { Exercise } from '../types/exercise';

const ManageExercisesPage: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseType, setNewExerciseType] = useState<'weight' | 'cardio'>('weight');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            setLoading(true);
            const data = await getExercises();
            setExercises(data);
            setError(null);
        } catch (err) {
            setError('Nie udało się wczytać ćwiczeń.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddExercise = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newExerciseName.trim()) {
            setError('Nazwa ćwiczenia nie może być pusta.');
            return;
        }

        try {
            setError(null);
            setSuccess(null);
            const newExercise = await createExercise({ name: newExerciseName, type: newExerciseType });
            setExercises([...exercises, newExercise]);
            setNewExerciseName('');
            setNewExerciseType('weight');
            setSuccess('Pomyślnie dodano nowe ćwiczenie!');
        } catch (err) {
            setError('Nie udało się dodać ćwiczenia.');
            console.error(err);
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<'weight' | 'cardio'>) => {
        setNewExerciseType(event.target.value as 'weight' | 'cardio');
    };

    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Zarządzaj Ćwiczeniami
                </Typography>

                <Box component="form" onSubmit={handleAddExercise} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Dodaj Nowe Ćwiczenie
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                    <TextField
                        label="Nazwa Ćwiczenia"
                        variant="outlined"
                        fullWidth
                        value={newExerciseName}
                        onChange={(e) => setNewExerciseName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="exercise-type-label">Typ Ćwiczenia</InputLabel>
                        <Select
                            labelId="exercise-type-label"
                            value={newExerciseType}
                            label="Typ Ćwiczenia"
                            onChange={handleTypeChange}
                        >
                            <MenuItem value="weight">Siłowe (Ciężar i Powtórzenia)</MenuItem>
                            <MenuItem value="cardio">Cardio (Dystans i Czas)</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary">
                        Dodaj Ćwiczenie
                    </Button>
                </Box>

                <Typography variant="h6" gutterBottom>
                    Lista Istniejących Ćwiczeń
                </Typography>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <List>
                        {exercises.map((exercise) => (
                            <ListItem key={exercise._id} divider>
                                <ListItemText
                                    primary={exercise.name}
                                    secondary={exercise.type === 'weight' ? 'Siłowe' : 'Cardio'}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Container>
    );
};

export default ManageExercisesPage;