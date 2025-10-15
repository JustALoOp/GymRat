import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, CircularProgress, Paper, Alert } from '@mui/material';
import WorkoutPlanList from '../components/WorkoutPlanList';
import WorkoutPlanForm from '../components/WorkoutPlanForm';
import { getWorkoutPlans, createWorkoutPlan, WorkoutPlanInput } from '../api/workoutPlans';
import type { IWorkoutPlan } from '../types/workoutPlan';

const WorkoutPlansPage: React.FC = () => {
    const [workoutPlans, setWorkoutPlans] = useState<IWorkoutPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormVisible, setFormVisible] = useState(false);

    useEffect(() => {
        const fetchWorkoutPlans = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication token not found.');
                setIsLoading(false);
                return;
            }
            try {
                const plans = await getWorkoutPlans(token);
                setWorkoutPlans(plans);
            } catch (err) {
                setError('Failed to fetch workout plans.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkoutPlans();
    }, []);

    const handleCreatePlan = async (data: WorkoutPlanInput) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication token not found.');
            return;
        }
        try {
            const newPlan = await createWorkoutPlan(data, token);
            setWorkoutPlans([...workoutPlans, newPlan]);
            setFormVisible(false);
        } catch (err) {
            setError('Failed to create workout plan.');
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
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
                    <WorkoutPlanForm onSubmit={handleCreatePlan} />
                </Paper>
            )}

            <Paper elevation={3} sx={{ mt: 3, p: 2 }}>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <WorkoutPlanList workoutPlans={workoutPlans} />
                )}
            </Paper>
        </Box>
    );
};

export default WorkoutPlansPage;