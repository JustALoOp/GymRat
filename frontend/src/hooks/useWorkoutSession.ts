import { useCallback, useState } from 'react';
import { createWorkoutSession as apiCreateWorkoutSession } from '../api/workouts';
import type { IWorkoutSession, WorkoutSessionInput } from '../types/workoutSession';

export const useWorkoutSession = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createWorkoutSession = useCallback(async (sessionData: WorkoutSessionInput): Promise<IWorkoutSession> => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCreateWorkoutSession(sessionData);
            setLoading(false);
            return result;
        } catch (err: any) {
            setError(err.message || 'Failed to create session');
            setLoading(false);
            throw err;
        }
    }, []);

    return { createWorkoutSession, loading, error };
};