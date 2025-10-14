import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import VolumeChart from '../components/VolumeChart';
import { getUniqueExercises } from '../api/stats';

interface Exercise {
    _id: string;
    name: string;
}

const DashboardPage: React.FC = () => {
    const token = localStorage.getItem('token');
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<string>('');
    const [selectedExerciseName, setSelectedExerciseName] = useState<string>('');

    useEffect(() => {
        const fetchExercises = async () => {
            if (token) {
                try {
                    const uniqueExercises = await getUniqueExercises(token);
                    setExercises(uniqueExercises);
                    if (uniqueExercises.length > 0) {
                        setSelectedExercise(uniqueExercises[0]._id);
                        setSelectedExerciseName(uniqueExercises[0].name);
                    }
                } catch (error) {
                    console.error('Error fetching unique exercises:', error);
                }
            }
        };

        fetchExercises();
    }, [token]);

    const handleExerciseChange = (event: SelectChangeEvent<string>) => {
        const exerciseId = event.target.value;
        setSelectedExercise(exerciseId);
        const exercise = exercises.find(ex => ex._id === exerciseId);
        if (exercise) {
            setSelectedExerciseName(exercise.name);
        }
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to your Dashboard
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="exercise-select-label">Select Exercise</InputLabel>
                    <Select
                        labelId="exercise-select-label"
                        id="exercise-select"
                        value={selectedExercise}
                        label="Select Exercise"
                        onChange={handleExerciseChange}
                    >
                        {exercises.map((exercise) => (
                            <MenuItem key={exercise._id} value={exercise._id}>
                                {exercise.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Typography variant="h6" component="h2" gutterBottom>
                    Volume History for: {selectedExerciseName || '...'}
                </Typography>

                {token && selectedExercise ? (
                    <VolumeChart exerciseId={selectedExercise} token={token} />
                ) : (
                    <Typography>
                        {token ? 'Select an exercise to see the chart.' : 'Please log in to see the chart.'}
                    </Typography>
                )}
            </Paper>
        </Container>
    );
};

export default DashboardPage;