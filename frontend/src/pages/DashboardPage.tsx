import React from 'react';
import { Typography, Container } from '@mui/material';

const DashboardPage: React.FC = () => {
    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Welcome to your Dashboard
            </Typography>
            <Typography variant="body1">
                This is your personal space. More features coming soon!
            </Typography>
        </Container>
    );
};

export default DashboardPage;