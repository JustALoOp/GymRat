import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Typography, Box, CircularProgress, Paper, Alert, Divider, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { getWorkoutSession } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';

const WorkoutSessionDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [session, setSession] = useState<IWorkoutSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Session ID is missing.');
            setIsLoading(false);
            return;
        }

        const fetchSession = async () => {
            try {
                const data = await getWorkoutSession(id);
                setSession(data);
            } catch (err) {
                setError('Failed to fetch workout session details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id]);

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!session) return <Typography>Workout session not found.</Typography>;

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h4" gutterBottom>
                {session.workoutPlan?.name || 'Workout Session'}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {new Date(session.date).toLocaleString()}
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Typography variant="h5" component="h2" gutterBottom>
                Performed Exercises
            </Typography>
            {session.performedExercises.map((pEx) => (
                <Box key={pEx.exercise._id} sx={{ mb: 3 }}>
                    <Typography variant="h6">{pEx.exercise.name}</Typography>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Set</TableCell>
                                    <TableCell align="right">Weight (kg)</TableCell>
                                    <TableCell align="right">Reps</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pEx.sets.map((set, index) => (
                                    <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component="th" scope="row">{index + 1}</TableCell>
                                        <TableCell align="right">{set.weight}</TableCell>
                                        <TableCell align="right">{set.reps}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ))}
        </Paper>
    );
};

export default WorkoutSessionDetailsPage;