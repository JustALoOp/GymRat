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
    SelectChangeEvent,
    IconButton,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getExercises, createExercise, updateExercise, deleteExercise } from '../api/exercises';
import { Exercise } from '../types/exercise';

const ManageExercisesPage: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [newExerciseType, setNewExerciseType] = useState<'weight' | 'cardio'>('weight');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);

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

    const handleEditClick = (exercise: Exercise) => {
        setCurrentExercise(exercise);
        setIsEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setIsEditDialogOpen(false);
        setCurrentExercise(null);
    };

    const handleUpdateExercise = async () => {
        if (!currentExercise) return;

        try {
            const updated = await updateExercise(currentExercise._id, {
                name: currentExercise.name,
                type: currentExercise.type,
            });
            setExercises(exercises.map((ex) => (ex._id === updated._id ? updated : ex)));
            handleEditClose();
            setSuccess('Pomyślnie zaktualizowano ćwiczenie!');
        } catch (err) {
            setError('Nie udało się zaktualizować ćwiczenia.');
        }
    };

    const handleDeleteExercise = async (id: string) => {
        if (window.confirm('Czy na pewno chcesz usunąć to ćwiczenie?')) {
            try {
                await deleteExercise(id);
                setExercises(exercises.filter((ex) => ex._id !== id));
                setSuccess('Pomyślnie usunięto ćwiczenie!');
            } catch (err) {
                setError('Nie udało się usunąć ćwiczenia.');
            }
        }
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
                            <ListItem
                                key={exercise._id}
                                divider
                                secondaryAction={
                                    <Stack direction="row" spacing={1}>
                                        <IconButton edge="end" aria-label="edit" onClick={() => handleEditClick(exercise)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteExercise(exercise._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                }
                            >
                                <ListItemText
                                    primary={exercise.name}
                                    secondary={exercise.type === 'weight' ? 'Siłowe' : 'Cardio'}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                {currentExercise && (
                    <Dialog open={isEditDialogOpen} onClose={handleEditClose} fullWidth maxWidth="sm">
                        <DialogTitle>Edytuj Ćwiczenie</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nazwa Ćwiczenia"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentExercise.name}
                                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                                sx={{ mt: 2 }}
                            />
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>Typ Ćwiczenia</InputLabel>
                                <Select
                                    value={currentExercise.type}
                                    label="Typ Ćwiczenia"
                                    onChange={(e) => setCurrentExercise({ ...currentExercise, type: e.target.value as 'weight' | 'cardio' })}
                                >
                                    <MenuItem value="weight">Siłowe (Ciężar i Powtórzenia)</MenuItem>
                                    <MenuItem value="cardio">Cardio (Dystans i Czas)</MenuItem>
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose}>Anuluj</Button>
                            <Button onClick={handleUpdateExercise} variant="contained">Zapisz</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Paper>
        </Container>
    );
};

export default ManageExercisesPage;