import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
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

    const data: VolumeData[] = useMemo(() => {
        const volumeByDate: { [date: string]: number } = {};

        sessions.forEach(session => {
            const date = new Date(session.date).toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting

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
        return <div>No data available for this exercise.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default VolumeChart;