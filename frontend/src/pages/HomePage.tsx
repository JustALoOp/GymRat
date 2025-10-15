import React from 'react';
import { Typography, Button, Container, Box, Grid, Paper, Icon } from '@mui/material';
import { Link } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FeatureCard: React.FC<{ icon: React.ReactElement, title: string, description: string }> = ({ icon, title, description }) => (
    <Paper elevation={4} sx={{ p: 4, textAlign: 'center', height: '100%', backgroundColor: 'background.paper' }}>
        <Icon color="primary" sx={{ fontSize: 50, mb: 2 }}>{icon}</Icon>
        <Typography variant="h5" component="h3" gutterBottom>{title}</Typography>
        <Typography color="text.secondary">{description}</Typography>
    </Paper>
);

const HomePage: React.FC = () => {
    const token = localStorage.getItem('token');

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Hero Section */}
            <Box
                sx={{
                    pt: 12,
                    pb: 12,
                    textAlign: 'center',
                    background: (theme) => `linear-gradient(45deg, ${theme.palette.background.default} 30%, ${theme.palette.background.paper} 90%)`,
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Welcome to <span style={{ color: '#FFD700' }}>GymRat</span>
                    </Typography>
                    <Typography variant="h5" component="p" color="text.secondary" sx={{ mb: 4 }}>
                        Your ultimate partner in tracking strength training progress. Monitor your lifts, visualize your gains, and crush your fitness goals.
                    </Typography>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        {token ? (
                            <Button variant="contained" color="primary" component={Link} to="/dashboard" size="large" endIcon={<ArrowForwardIcon />}>
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button variant="contained" color="primary" component={Link} to="/register" size="large">
                                    Get Started for Free
                                </Button>
                                <Button variant="outlined" color="primary" component={Link} to="/login" size="large">
                                    Login
                                </Button>
                            </>
                        )}
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Typography variant="h2" component="h2" sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
                    Core Features
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            icon={<EventNoteIcon />}
                            title="Custom Plans"
                            description="Create and manage your personalized workout plans tailored to your specific goals."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            icon={<FitnessCenterIcon />}
                            title="Track Workouts"
                            description="Log every set and rep with our intuitive interface to monitor your performance in real-time."
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FeatureCard
                            icon={<BarChartIcon />}
                            title="Visualize Progress"
                            description="Analyze your lifting history with detailed charts and statistics to see how far you've come."
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default HomePage;