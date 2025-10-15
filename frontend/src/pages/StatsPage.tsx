import React, { useState, useEffect, useMemo } from 'react';
import {
    Typography, Select, MenuItem, FormControl, InputLabel, Grid, Box, CircularProgress, Alert, Card, CardContent
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import VolumeChart from '../components/VolumeChart';
import MuscleGroupPieChart from '../components/MuscleGroupPieChart';
import { getUniqueExercises } from '../api/stats';
import { getWorkoutSessions } from '../api/workouts';
import type { IWorkoutSession } from '../types/workoutSession';

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
        <CardContent>
            <Typography variant="h6" color="text.secondary">{title}</Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>{value}</Typography>
        </CardContent>
    </Card>
);

const StatsPage: React.FC = () => {
    const [exercises, setExercises] = useState<{ _id: string; name: string }[]>([]);
    const [sessions, setSessions] = useState<IWorkoutSession[]>([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [uniqueExercises, allSessions] = await Promise.all([
                    getUniqueExercises(),
                    getWorkoutSessions(),
                ]);
                setExercises(uniqueExercises);
                setSessions(allSessions);
                if (uniqueExercises.length > 0) {
                    setSelectedExerciseId(uniqueExercises[0]._id);
                }
            } catch (err) {
                setError('Failed to fetch statistics data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleExerciseChange = (event: SelectChangeEvent<string>) => {
        setSelectedExerciseId(event.target.value);
    };

    const totalWorkouts = useMemo(() => sessions.length, [sessions]);
    const totalVolume = useMemo(() =>
        sessions.reduce((acc, session) => acc + session.performedExercises.reduce((sAcc, pEx) => sAcc + pEx.sets.reduce((setAcc, set) => setAcc + set.weight * set.reps, 0), 0), 0),
        [sessions]
    );
    const maxWeightLifted = useMemo(() =>
        Math.max(0, ...sessions.flatMap(s => s.performedExercises.flatMap(pEx => pEx.sets.map(set => set.weight))))
    , [sessions]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;

    return (
        <Box>
            <Grid container spacing={3}>
                {/* General Stats Cards */}
                <Grid item xs={12} sm={4}><StatCard title="Total Workouts" value={totalWorkouts} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Total Volume (kg)" value={totalVolume.toLocaleString()} /></Grid>
                <Grid item xs={12} sm={4}><StatCard title="Heaviest Lift (kg)" value={maxWeightLifted} /></Grid>

                {/* Volume History Chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Volume History</Typography>
                                <FormControl sx={{ minWidth: 200 }} size="small">
                                    <InputLabel>Exercise</InputLabel>
                                    <Select value={selectedExerciseId} label="Exercise" onChange={handleExerciseChange}>
                                        {exercises.map((ex) => <MenuItem key={ex._id} value={ex._id}>{ex.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Box>
                            {selectedExerciseId && sessions.length > 0 ? (
                                <VolumeChart exerciseId={selectedExerciseId} sessions={sessions} />
                            ) : <Typography sx={{ textAlign: 'center', p: 4 }}>No data available.</Typography>}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Muscle Group Pie Chart */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 2 }}>Volume by Muscle Group</Typography>
                            {sessions.length > 0 ? (
                                <MuscleGroupPieChart sessions={sessions} />
                            ) : <Typography sx={{ textAlign: 'center', p: 4 }}>No data available.</Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StatsPage;