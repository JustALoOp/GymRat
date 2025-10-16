import React from 'react';
import { Typography, Button, Container, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    const token = localStorage.getItem('token');

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Welcome to GymRat
            </Typography>
            <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
                Your personal partner in tracking strength training progress. Monitor your lifts, visualize your gains, and stay motivated on your fitness journey.
            </Typography>
            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                {token ? (
                    <Button variant="contained" color="primary" component={Link} to="/dashboard" size="large" sx={{ color: 'inherit', textDecoration: 'none' }}>
                        Go to Dashboard
                    </Button>
                ) : (
                    <>
                        <Button variant="contained" color="primary" component={Link} to="/register" size="large" sx={{ color: 'inherit', textDecoration: 'none' }}>
                            Get Started
                        </Button>
                        <Button variant="outlined" color="primary" component={Link} to="/login" size="large" sx={{ color: 'inherit', textDecoration: 'none' }}>
                            Login
                        </Button>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default HomePage;