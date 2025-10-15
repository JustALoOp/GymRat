import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Box, CircularProgress, Paper, Alert, Button, Divider, List, ListItem,
    ListItemText, ListItemAvatar, Avatar, IconButton, Fab
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getWorkoutPlan, deleteWorkoutPlan } from '../api/workoutPlans';
import type { IWorkoutPlan } from '../types/workoutPlan';

const WorkoutPlanDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError('Plan ID is missing.');
            setIsLoading(false);
            return;
        }

        const fetchWorkoutPlan = async () => {
            try {
                const plan = await getWorkoutPlan(id);
                setWorkoutPlan(plan);
            } catch (err) {
                setError('Failed to fetch workout plan details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkoutPlan();
    }, [id]);

    const handleDelete = async () => {
        if (!id) {
            setError('Plan ID is missing.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this workout plan?')) {
            try {
                await deleteWorkoutPlan(id);
                navigate('/workout-plans');
            } catch (err) {
                setError('Failed to delete workout plan.');
            }
        }
    };

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!workoutPlan) {
        return <Typography>Workout plan not found.</Typography>;
    }

    return (
        <Paper sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                    <Typography variant="h4" component="h1" gutterBottom>{workoutPlan.name}</Typography>
                    {workoutPlan.description && <Typography variant="body1" color="text.secondary">{workoutPlan.description}</Typography>}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                    <Button variant="outlined" color="error" onClick={handleDelete} startIcon={<DeleteIcon />}>
                        Delete Plan
                    </Button>
                </Box>
            </Box>
            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">Exercises</Typography>
                <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                    Add Exercise
                </Button>
            </Box>

            <List>
                {workoutPlan.exercises.map(({ exercise, sets, reps }, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit">
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" sx={{ ml: 1 }}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                        sx={{
                            mb: 1,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            p: 2
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <FitnessCenterIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={exercise.name}
                            secondary={`Sets: ${sets} | Reps: ${reps}`}
                        />
                    </ListItem>
                ))}
            </List>

            {workoutPlan.exercises.length === 0 && (
                <Typography sx={{ textAlign: 'center', my: 4 }} color="text.secondary">
                    This plan has no exercises yet. Add one to get started!
                </Typography>
            )}

            <Fab
                color="primary"
                variant="extended"
                aria-label="start workout"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => navigate(`/workouts/active/${workoutPlan._id}`)}
            >
                <PlayArrowIcon sx={{ mr: 1 }} />
                Start Workout
            </Fab>
        </Paper>
    );
};

export default WorkoutPlanDetailsPage;