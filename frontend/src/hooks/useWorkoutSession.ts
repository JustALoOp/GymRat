import { useCallback } from 'react';
import { createWorkoutSession as apiCreateWorkoutSession } from '../api/workouts';
import type { WorkoutSessionInput } from '../types/workoutSession';

export const useWorkoutSession = () => {
    const token = localStorage.getItem('token');

    const createWorkoutSession = useCallback(async (sessionData: WorkoutSessionInput) => {
        if (!token) {
            throw new Error("Authentication token not found.");
        }
        return await apiCreateWorkoutSession(sessionData, token);
    }, [token]);

    return { createWorkoutSession };
};