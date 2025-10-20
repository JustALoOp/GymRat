import React, { useState, useEffect } from 'react';
import { Typography, Paper, Grid, Box, CircularProgress, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getOverallStats } from '../api/stats';

interface OverallStats {
    totalSessions: number;
    totalVolume: number;
    weeklyVolume: { week: string; volume: number }[];
}

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">{title}</Typography>
        <Typography variant="h4" component="p" sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Paper>
);

const StatsPage: React.FC = () => {
    const [stats, setStats] = useState<OverallStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getOverallStats();
                setStats(data);
            } catch (err) {
                setError('Nie udało się wczytać statystyk. Spróbuj ponownie później.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }

    if (!stats || stats.weeklyVolume.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6">Brak wystarczających danych do wyświetlenia statystyk.</Typography>
                <Typography color="text.secondary">Ukończ kilka treningów, aby zobaczyć swoje postępy!</Typography>
            </Box>
        );
    }

    const formattedWeeklyVolume = stats.weeklyVolume.map(item => ({
        ...item,
        weekLabel: `Tydzień ${item.week.substring(5)}`
    }));


    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Statystyki ogólne
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                    <StatCard title="Całkowita liczba treningów" value={stats.totalSessions} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StatCard title="Całkowita objętość (kg)" value={stats.totalVolume.toLocaleString()} />
                </Grid>
            </Grid>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: 400 }}>
                 <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Tygodniowa objętość treningowa (kg)
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={formattedWeeklyVolume}
                        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="weekLabel" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                        <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
                        <Line type="monotone" name="Objętość" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default StatsPage;