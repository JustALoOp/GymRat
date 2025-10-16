import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { register } from '../api/auth';
import {
    Box, Typography, TextField, Button, Alert, CircularProgress, Grid, Card, CardContent, Link
} from '@mui/material';
import { isAxiosError } from 'axios';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate('/login');
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'An unexpected error occurred during registration.');
            } else {
                setError('An unexpected error occurred during registration.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container component="main" sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Grid item xs={12} sm={8} md={5} component={Card} variant="outlined" sx={{ maxWidth: 450 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <FitnessCenterIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography component="h1" variant="h4" sx={{ mt: 1, color: 'primary.main' }}>
                            GymRat
                        </Typography>
                        <Typography component="h2" variant="h5" sx={{ mt: 2 }}>
                            Sign Up
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            inputProps={{ 'data-testid': 'password-input' }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                            inputProps={{ 'data-testid': 'confirm-password-input' }}
                        />
                        {error && (
                            <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                {error}
                            </Alert>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Grid>
        </Grid>
    );
};

export default RegisterPage;