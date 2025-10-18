import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography, Box, CircularProgress, Paper, Alert, Button, Stepper, Step, StepLabel,
    Card, CardContent, TextField, IconButton, List, ListItem, ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
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
    const [activeStep, setActiveStep] = useState(0);

    const { createWorkoutSession, loading: isSaving } = useWorkoutSession();

    useEffect(() => {
        if (!planId) {
            setError('Brak ID planu.');
            setIsLoading(false);
            return;
        }
        const fetchWorkoutPlan = async () => {
            try {
                const plan = await getWorkoutPlan(planId);
                setWorkoutPlan(plan);
                const initialTracker: TrackedExercise[] = plan.exercises.map((ex: IWorkoutPlanExercise) => ({
                    exerciseId: ex.exercise._id,
                    name: ex.exercise.name,
                    sets: Array.from({ length: ex.sets }, () => ({
                        weight: '',
                        reps: ex.reps.toString(),
                        completed: false,
                    })),
                }));
                setTrackedExercises(initialTracker);
            } catch (err) {
                setError('Nie udało się wczytać szczegółów planu treningowego.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchWorkoutPlan();
    }, [planId]);

    const handleSetChange = (setIndex: number, field: keyof TrackedSet, value: any) => {
        const newTrackedExercises = [...trackedExercises];
        const currentExercise = newTrackedExercises[activeStep];
        (currentExercise.sets[setIndex] as any)[field] = value;
        setTrackedExercises(newTrackedExercises);
    };

    const toggleSetCompletion = (setIndex: number) => {
        const currentExercise = trackedExercises[activeStep];
        const isCompleted = !currentExercise.sets[setIndex].completed;
        handleSetChange(setIndex, 'completed', isCompleted);
    };

    const handleNext = () => setActiveStep((prev) => Math.min(prev + 1, trackedExercises.length));
    const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

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
            navigate('/workouts', { state: { message: 'Sesja treningowa została zapisana!' } });
        } catch (err) {
            setError('Nie udało się zapisać sesji treningowej.');
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!workoutPlan || trackedExercises.length === 0) return <Typography>Nie znaleziono planu treningowego lub jest on pusty.</Typography>;

    const currentExercise = trackedExercises[activeStep];

    return (
        <Paper sx={{ p: { xs: 2, sm: 3 }, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center">{workoutPlan.name}</Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {trackedExercises.map((ex) => (
                    <Step key={ex.exerciseId}><StepLabel>{ex.name}</StepLabel></Step>
                ))}
            </Stepper>

            {activeStep < trackedExercises.length ? (
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>{currentExercise.name}</Typography>
                        <List>
                            {currentExercise.sets.map((set, setIndex) => (
                                <ListItem key={setIndex} divider>
                                    <ListItemText primary={`Seria ${setIndex + 1}`} />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <TextField label="Ciężar (kg)" variant="outlined" size="small" value={set.weight} onChange={(e) => handleSetChange(setIndex, 'weight', e.target.value)} sx={{ width: '100px' }} />
                                        <TextField label="Powtórzenia" variant="outlined" size="small" value={set.reps} onChange={(e) => handleSetChange(setIndex, 'reps', e.target.value)} sx={{ width: '100px' }} />
                                        <IconButton color={set.completed ? 'success' : 'default'} onClick={() => toggleSetCompletion(setIndex)}>
                                            {set.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            ) : (
                <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography variant="h5">Trening ukończony!</Typography>
                    <Typography color="text.secondary">Gotowy, aby zapisać swoją sesję?</Typography>
                </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>Wróć</Button>
                {activeStep < trackedExercises.length - 1 ? (
                    <Button variant="contained" onClick={handleNext}>Następne ćwiczenie</Button>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleFinishWorkout} disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24}/> : 'Zakończ i zapisz trening'}
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default ActiveWorkoutPage;