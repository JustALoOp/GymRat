import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getVolumeHistory } from '../api/stats';

interface VolumeData {
    date: string;
    volume: number;
}

interface VolumeChartProps {
    exerciseId: string;
    token: string;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ exerciseId, token }) => {
    const [data, setData] = useState<VolumeData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const history = await getVolumeHistory(exerciseId, token);
                setData(history);
            } catch (err) {
                setError('Failed to fetch volume history');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [exerciseId, token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
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