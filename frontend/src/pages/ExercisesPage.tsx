import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Typography, Button, Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar,
    TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { getExercises, deleteExercise } from '../api/exercises';
import type { Exercise } from '../types/exercise';
import ExerciseForm from '../components/ExerciseForm';

const ExercisesPage: React.FC = () => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [exerciseToEdit, setExerciseToEdit] = useState<Exercise | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const [searchTerm, setSearchTerm] = useState('');
    const [muscleGroupFilter, setMuscleGroupFilter] = useState('All');

    const fetchExercises = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getExercises();
            setExercises(data);
        } catch (err) {
            setError('Failed to fetch exercises.');
        } finally {
            setLoading(false);
        }
    }, []);

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

    const handleSuccess = (message: string) => {
        handleCloseForm();
        fetchExercises();
        setSnackbar({ open: true, message, severity: 'success' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this exercise?')) {
            try {
                await deleteExercise(id);
                fetchExercises();
                setSnackbar({ open: true, message: 'Exercise deleted successfully!', severity: 'success' });
            } catch (err) {
                setSnackbar({ open: true, message: 'Failed to delete exercise.', severity: 'error' });
            }
        }
    };

    const filteredExercises = useMemo(() => {
        return exercises
            .filter(ex => ex.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(ex => muscleGroupFilter === 'All' || ex.muscleGroup === muscleGroupFilter);
    }, [exercises, searchTerm, muscleGroupFilter]);

    const muscleGroups = useMemo(() => ['All', ...new Set(exercises.map(ex => ex.muscleGroup))], [exercises]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" component="h1">Exercises</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
                    Add Exercise
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Muscle Group</InputLabel>
                    <Select
                        value={muscleGroupFilter}
                        label="Muscle Group"
                        onChange={(e) => setMuscleGroupFilter(e.target.value)}
                    >
                        {muscleGroups.map(group => <MenuItem key={group} value={group}>{group}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Muscle Group</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExercises.map((exercise) => (
                            <TableRow key={exercise._id} hover>
                                <TableCell component="th" scope="row">{exercise.name}</TableCell>
                                <TableCell>{exercise.muscleGroup}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenForm(exercise)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(exercise._id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={isFormOpen} onClose={handleCloseForm} maxWidth="sm" fullWidth>
                <DialogTitle>{exerciseToEdit ? 'Edit Exercise' : 'Add New Exercise'}</DialogTitle>
                <DialogContent>
                    <ExerciseForm onSuccess={handleSuccess} onCancel={handleCloseForm} exerciseToEdit={exerciseToEdit} />
                </DialogContent>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default ExercisesPage;