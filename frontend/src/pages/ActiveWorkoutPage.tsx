import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    CircularProgress,
    Paper,
    Alert,
    Button,
    Divider,
    TextField,
    Checkbox,
    FormControlLabel,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getWorkoutPlan } from '../api/workoutPlans';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import type { IWorkoutPlan, IWorkoutPlanExercise } from '../types/workoutPlan';
import type { WorkoutSessionInput } from '../types/workoutSession';

interface TrackedSet {
    weight: string;
    reps: string;
    completed: boolean;
}

interface TrackedExercise {
    exerciseId: string;
    name: string;
    sets: TrackedSet[];
}

const ActiveWorkoutPage: React.FC = () => {
    const { planId } = useParams<{ planId: string }>();
    const navigate = useNavigate();
    const [workoutPlan, setWorkoutPlan] = useState<IWorkoutPlan | null>(null);
    const [trackedExercises, setTrackedExercises] = useState<TrackedExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

    const initializeTracker = (plan: IWorkoutPlan) => {
        const initialTracker: TrackedExercise[] = plan.exercises.map((ex: IWorkoutPlanExercise) => ({
            exerciseId: ex.exercise._id,
            name: ex.exercise.name,
            sets: Array.from({ length: ex.sets }, () => ({
                weight: '',
                reps: ex.reps.toString(), // pre-fill reps from plan
                completed: false,
            })),
        }));
        setTrackedExercises(initialTracker);
    };

    useEffect(() => {
        if (!planId || !token) {
            setError('Plan ID or authentication token is missing.');
            setIsLoading(false);
            return;
        }

        const fetchWorkoutPlan = async () => {
            try {
                const plan = await getWorkoutPlan(planId, token);
                setWorkoutPlan(plan);
                initializeTracker(plan);
            } catch (err) {
                setError('Failed to fetch workout plan details.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWorkoutPlan();
    }, [planId, token]);

    const handleSetChange = (exerciseIndex: number, setIndex: number, field: keyof TrackedSet, value: any) => {
        const newTrackedExercises = [...trackedExercises];
        (newTrackedExercises[exerciseIndex].sets[setIndex] as any)[field] = value;
        setTrackedExercises(newTrackedExercises);
    };

    const allSetsCompleted = useMemo(() =>
        trackedExercises.every(ex => ex.sets.every(s => s.completed)),
        [trackedExercises]
    );

    const { createWorkoutSession } = useWorkoutSession(); // Custom hook for API calls

    const handleFinishWorkout = async () => {
        if (!workoutPlan) return;

        const sessionData: WorkoutSessionInput = {
            workoutPlan: workoutPlan._id,
            performedExercises: trackedExercises.map(ex => ({
                exercise: ex.exerciseId,
                sets: ex.sets.map(s => ({
                    weight: parseFloat(s.weight) || 0,
                    reps: parseInt(s.reps, 10) || 0,
                    completed: s.completed,
                })),
            })),
        };

        try {
            await createWorkoutSession(sessionData);
            navigate('/workouts', { state: { message: 'Workout session saved successfully!' } });
        } catch (error) {
            console.error("Failed to save workout session", error);
            // Here you could set an error state and display a snackbar
        }
    };

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!workoutPlan) return <Typography>Workout plan not found.</Typography>;

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {workoutPlan.name}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {trackedExercises.map((trackedEx, exerciseIndex) => (
                <Accordion key={trackedEx.exerciseId} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">{trackedEx.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box>
                            {trackedEx.sets.map((set, setIndex) => (
                                <Box key={setIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Typography sx={{ minWidth: '50px' }}>Set {setIndex + 1}</Typography>
                                    <TextField
                                        label="Weight (kg)"
                                        variant="outlined"
                                        size="small"
                                        value={set.weight}
                                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                    />
                                    <TextField
                                        label="Reps"
                                        variant="outlined"
                                        size="small"
                                        value={set.reps}
                                        onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={set.completed}
                                                onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'completed', e.target.checked)}
                                            />
                                        }
                                        label="Done"
                                    />
                                </Box>
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}

            <Box mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFinishWorkout}
                    disabled={!allSetsCompleted}
                >
                    Finish Workout
                </Button>
            </Box>
        </Paper>
    );
};

export default ActiveWorkoutPage;