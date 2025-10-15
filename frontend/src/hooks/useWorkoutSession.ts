import { useCallback, useState } from 'react';
import { createWorkoutSession as apiCreateWorkoutSession } from '../api/workouts';
import type { WorkoutSessionInput } from '../types/workoutSession';

export const useWorkoutSession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createWorkoutSession = useCallback(async (sessionData: WorkoutSessionInput) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCreateWorkoutSession(sessionData);
            return result;
        } catch (err: any) {
            setError(err.message || 'Failed to create session');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createWorkoutSession, loading, error };
};