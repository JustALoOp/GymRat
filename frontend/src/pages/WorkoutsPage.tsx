import React from 'react';
import { Typography, Container } from '@mui/material';
import WorkoutList from '../components/WorkoutList';

const WorkoutsPage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Workouts
            </Typography>
            <WorkoutList />
        </Container>
    );
};

export default WorkoutsPage;