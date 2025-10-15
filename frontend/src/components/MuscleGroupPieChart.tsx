import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import type { IWorkoutSession } from '../types/workoutSession';

interface MuscleGroupData {
    name: string;
    value: number;
}

// More vibrant and theme-consistent colors
const COLORS = ['#FFD700', '#FF8042', '#00C49F', '#0088FE', '#AF19FF', '#FF1919', '#19B3FF'];

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const theme = useTheme();
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill={theme.palette.getContrastText(theme.palette.background.paper)}
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="14px"
        >
            {`${name} (${(percent * 100).toFixed(0)}%)`}
        </text>
    );
};


const MuscleGroupPieChart: React.FC<{ sessions: IWorkoutSession[] }> = ({ sessions }) => {
    const theme = useTheme();

    const data: MuscleGroupData[] = useMemo(() => {
        const volumeByMuscleGroup: { [key: string]: number } = {};
        sessions.forEach(session => {
            session.performedExercises.forEach(pEx => {
                const muscleGroup = pEx.exercise.muscleGroup || 'Other';
                const exerciseVolume = pEx.sets.reduce((total, set) => total + set.weight * set.reps, 0);

                if (volumeByMuscleGroup[muscleGroup]) {
                    volumeByMuscleGroup[muscleGroup] += exerciseVolume;
                } else {
                    volumeByMuscleGroup[muscleGroup] = exerciseVolume;
                }
            });
        });
        return Object.keys(volumeByMuscleGroup).map(key => ({ name: key, value: volumeByMuscleGroup[key] }));
    }, [sessions]);

    if (data.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={<CustomLabel />}
                    outerRadius={100}
                    fill={theme.palette.primary.main}
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number) => `${value.toLocaleString()} kg`}
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                    }}
                />
                <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default MuscleGroupPieChart;