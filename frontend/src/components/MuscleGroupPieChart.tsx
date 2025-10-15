import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IWorkoutSession } from '../types/workoutSession';

interface MuscleGroupData {
    name: string;
    value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919', '#19B3FF'];

const MuscleGroupPieChart: React.FC<{ sessions: IWorkoutSession[] }> = ({ sessions }) => {
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

        return Object.keys(volumeByMuscleGroup).map(key => ({
            name: key,
            value: volumeByMuscleGroup[key],
        }));
    }, [sessions]);

    if (data.length === 0) {
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toLocaleString()} kg`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default MuscleGroupPieChart;