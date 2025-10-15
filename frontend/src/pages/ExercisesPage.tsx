import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography,
    Container,
    Button,
    Box,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getExercises, deleteExercise } from '../api/exercises';
import type { Exercise } from '../types/exercise';
import ExerciseForm from '../components/ExerciseForm';

const ExercisesPage: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
    const token = localStorage.getItem('token');

    const fetchExercises = useCallback(async () => {
        if (token) {
            try {
                setLoading(true);
                const data = await getExercises(token);
                setExercises(data);
            } catch (err) {
                setError('Failed to fetch exercises.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else {
            setError('Authentication token not found. Please log in.');
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises]);

    const handleOpenForm = (exercise?: Exercise) => {
        setExerciseToEdit(exercise || null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setExerciseToEdit(null);
    };

    const handleSuccess = () => {
        handleCloseForm();
        fetchExercises();
    };

    const handleDelete = async (id: string) => {
        if (token && window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await deleteExercise(id, token);
                fetchExercises(); // Refresh the list
            } catch (err) {
                setError('Failed to delete exercise.');
                console.error(err);
            }
        }
    };

    if (!token) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">You must be logged in to manage exercises.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">
                    Manage Exercises
                </Typography>
                <Button variant="contained" color="primary" onClick={() => handleOpenForm()}>
                    Add New Exercise
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {exercises.map((exercise) => (
                                <TableRow key={exercise._id}>
                                    <TableCell component="th" scope="row">
                                        {exercise.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenForm(exercise)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(exercise._id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{exerciseToEdit ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
                <DialogContent>
                    <ExerciseForm
                        onSuccess={handleSuccess}
                        onCancel={handleCloseForm}
                        exerciseToEdit={exerciseToEdit}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default ExercisesPage;