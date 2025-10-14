import React from 'react';
import { Typography, Container, Paper } from '@mui/material';
import VolumeChart from '../components/VolumeChart';

const DashboardPage: React.FC = () => {
    const token = localStorage.getItem('token');
    // TODO: Implement a way for the user to select an exercise
    const sampleExerciseId = '60d5f3f7e3b4a2345c68d777';

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to your Dashboard
            </Typography>
            <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Volume History (Sample: Bench Press)
                </Typography>
                {token ? (
                    <VolumeChart exerciseId={sampleExerciseId} token={token} />
                ) : (
                    <Typography>Please log in to see the chart.</Typography>
                )}
            </Paper>
        </Container>
    );
};

export default DashboardPage;