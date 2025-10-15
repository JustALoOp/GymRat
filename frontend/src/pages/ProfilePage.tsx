import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, TextField, Button, Box, CircularProgress, Alert, Divider, Stack } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { updateDetails, updatePassword } from '../api/auth';

const ProfilePage: React.FC = () => {
    const { user, loading, error: authError, refetch } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [detailsSuccess, setDetailsSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        setDetailsError(null);
        setDetailsSuccess(null);
        try {
            await updateDetails({ name, email });
            setDetailsSuccess('Details updated successfully!');
            refetch();
        } catch (err: any) {
            setDetailsError(err.response?.data?.error || 'Failed to update details.');
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long.');
            return;
        }
        try {
            await updatePassword({ currentPassword, newPassword });
            setPasswordSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err: any) {
            setPasswordError(err.response?.data?.error || 'Failed to change password.');
        }
    };

    if (loading) return <CircularProgress />;
    if (authError) return <Alert severity="error">{authError}</Alert>;

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>Your Profile</Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" component="h2" gutterBottom>Update Account Details</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack component="form" onSubmit={handleUpdateDetails} spacing={2}>
                            {detailsSuccess && <Alert severity="success">{detailsSuccess}</Alert>}
                            {detailsError && <Alert severity="error">{detailsError}</Alert>}
                            <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                            <Button type="submit" variant="contained">Save Changes</Button>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" component="h2" gutterBottom>Change Password</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Stack component="form" onSubmit={handleChangePassword} spacing={2}>
                            {passwordSuccess && <Alert severity="success">{passwordSuccess}</Alert>}
                            {passwordError && <Alert severity="error">{passwordError}</Alert>}
                            <TextField label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} fullWidth required />
                            <TextField label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} fullWidth required />
                            <Button type="submit" variant="contained">Change Password</Button>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;