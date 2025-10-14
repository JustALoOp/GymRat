import React from 'react';
import { Typography, Paper } from '@mui/material';

const WorkoutList: React.FC = () => {
    // W przyszłości tutaj będzie logika pobierania i wyświetlania treningów
    const workouts: any[] = [];

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            {workouts.length === 0 ? (
                <Typography variant="body1">No workouts found. Add your first workout!</Typography>
            ) : (
                <Typography variant="body1">Your workouts will be displayed here.</Typography>
            )}
        </Paper>
    );
};

export default WorkoutList;