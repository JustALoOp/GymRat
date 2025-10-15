import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import type { IWorkoutSession } from '../types/workoutSession';

interface VolumeData {
    date: string;
    volume: number;
}

interface VolumeChartProps {
    exerciseId: string;
    sessions: IWorkoutSession[];
}

const VolumeChart: React.FC<VolumeChartProps> = ({ exerciseId, sessions }) => {
    const theme = useTheme();

    const data: VolumeData[] = useMemo(() => {
        const volumeByDate: { [date: string]: number } = {};

        sessions.forEach(session => {
            const date = new Date(session.date).toLocaleDateString('en-CA'); // YYYY-MM-DD

            session.performedExercises.forEach(pEx => {
                if (pEx.exercise._id === exerciseId) {
                    const dailyVolume = pEx.sets.reduce((total, set) => total + (set.weight * set.reps), 0);
                    if (!volumeByDate[date]) {
                        volumeByDate[date] = 0;
                    }
                    volumeByDate[date] += dailyVolume;
                }
            });
        });

        return Object.entries(volumeByDate)
            .map(([date, volume]) => ({ date, volume }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    }, [exerciseId, sessions]);

    if (data.length === 0) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>No data available for this exercise.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
                <YAxis stroke={theme.palette.text.secondary} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                    }}
                />
                <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
                <Line
                    type="monotone"
                    dataKey="volume"
                    stroke={theme.palette.primary.main}
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                    dot={{ r: 4 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default VolumeChart;