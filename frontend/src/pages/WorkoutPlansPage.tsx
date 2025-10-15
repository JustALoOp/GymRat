import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Button, Box, CircularProgress, Paper, Alert, Snackbar } from '@mui/material';
import WorkoutPlanList from '../components/WorkoutPlanList';
import WorkoutPlanForm from '../components/WorkoutPlanForm';
import { getWorkoutPlans, createWorkoutPlan, WorkoutPlanInput } from '../api/workoutPlans';
import type { IWorkoutPlan } from '../types/workoutPlan';

const WorkoutPlansPage: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<IWorkoutPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
    const token = localStorage.getItem('token');

    const fetchWorkoutPlans = useCallback(async () => {
        if (!token) {
            setError('Authentication token not found.');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const plans = await getWorkoutPlans(token);
            setWorkoutPlans(plans);
        } catch (err) {
            setError('Failed to fetch workout plans.');
            setSnackbar({ open: true, message: 'Failed to fetch workout plans.', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchWorkoutPlans();
    }, [fetchWorkoutPlans]);

    const handleCreatePlan = async (data: WorkoutPlanInput) => {
        if (!token) {
            setError('Authentication token not found.');
            setSnackbar({ open: true, message: 'Authentication token not found.', severity: 'error' });
            return;
        }
        try {
            await createWorkoutPlan(data, token);
            setSnackbar({ open: true, message: 'Workout plan created successfully!', severity: 'success' });
            setFormVisible(false);
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
        return <CircularProgress />;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">
                    Workout Plans
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setFormVisible(!isFormVisible)}
                >
                    {isFormVisible ? 'Cancel' : 'Create New Plan'}
                </Button>
            </Box>

            {isFormVisible && (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                    <WorkoutPlanForm
                        onSubmit={handleCreatePlan}
                        onCancel={() => setFormVisible(false)}
                    />
                </Paper>
            )}

            {error && !isFormVisible && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : workoutPlans.length === 0 && !error ? (
                     <Typography>No workout plans found. Create one to get started!</Typography>
                ) : (
                    <WorkoutPlanList workoutPlans={workoutPlans} />
                )}
            </Paper>

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