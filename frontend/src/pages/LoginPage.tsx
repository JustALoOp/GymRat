import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { login } from '../api/auth';
import {
    Box, Typography, TextField, Button, Alert, CircularProgress, Grid, Card, CardContent, Link
} from '@mui/material';
import { isAxiosError } from 'axios';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const data = await login({ email, password });
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            if (isAxiosError(err) && err.response) {
                setError(err.response.data.error || 'An unexpected error occurred.');
            } else {
                setError('An unexpected error occurred.');
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
                            Sign In
                        </Typography>
                    </Box>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Grid>
        </Grid>
    );
};

export default LoginPage;