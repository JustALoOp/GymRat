import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Button, Box, CircularProgress, Alert, Snackbar, Grid, Card, CardContent,
    CardActions, Dialog, DialogTitle, DialogContent, Fab
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import WorkoutPlanForm from '../components/WorkoutPlanForm';
import { getWorkoutPlans, createWorkoutPlan, WorkoutPlanInput } from '../api/workoutPlans';
import type { IWorkoutPlan } from '../types/workoutPlan';

const WorkoutPlansPage: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<IWorkoutPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            setFormOpen(true);
        }
    }, [searchParams]);

    const fetchWorkoutPlans = useCallback(async () => {
        try {
            setIsLoading(true);
            const plans = await getWorkoutPlans();
            setWorkoutPlans(plans);
        } catch (err) {
            setError('Failed to fetch workout plans.');
            setSnackbar({ open: true, message: 'Failed to fetch workout plans.', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWorkoutPlans();
    }, [fetchWorkoutPlans]);

    const handleCreatePlan = async (data: WorkoutPlanInput) => {
        try {
            await createWorkoutPlan(data);
            setSnackbar({ open: true, message: 'Workout plan created successfully!', severity: 'success' });
            setFormOpen(false);
            fetchWorkoutPlans(); // Refresh the list
        } catch (err) {
            setError('Failed to create workout plan.');
            setSnackbar({ open: true, message: 'Failed to create workout plan.', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (isLoading && !workoutPlans.length) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Grid container spacing={3}>
                {workoutPlans.map((plan) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={plan._id} sx={{ flexGrow: workoutPlans.length === 1 ? 1 : 0 }}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h5" component="div">
                                    {plan.name}
                                </Typography>
                                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                                    {plan.description || 'No description available.'}
                                </Typography>
                                <Typography sx={{ mt: 2 }} variant="body2">
                                    <FitnessCenterIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                                    {plan.exercises.length} exercise(s)
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ flexWrap: 'wrap', gap: 1 }}>
                                <Button size="small" component={Link} to={`/workout-plans/${plan._id}`} startIcon={<EditIcon />}>
                                    View & Edit
                                </Button>
                                <Button size="small" color="primary" onClick={() => navigate(`/workouts/active/${plan._id}`)}>
                                    Start Workout
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            { !isLoading && workoutPlans.length === 0 && !error && (
                 <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="h6">No workout plans found.</Typography>
                    <Typography color="text.secondary">Create one to get started!</Typography>
                    <Button variant="contained" sx={{ mt: 2 }} onClick={() => setFormOpen(true)}>Create Your First Plan</Button>
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => setFormOpen(true)}
            >
                <AddIcon />
            </Fab>

            <Dialog open={isFormOpen} onClose={() => setFormOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Workout Plan</DialogTitle>
                <DialogContent>
                    <WorkoutPlanForm
                        onSubmit={handleCreatePlan}
                        onCancel={() => setFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default WorkoutPlansPage;