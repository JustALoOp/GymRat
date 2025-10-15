import apiClient from './apiClient';
import type { IWorkoutSession, WorkoutSessionInput } from '../types/workoutSession';

/**
 * Fetches all workout sessions for the logged-in user.
 * @returns A list of workout sessions.
 */
export const getWorkoutSessions = async (): Promise<IWorkoutSession[]> => {
    const response = await apiClient.get('/workoutsessions');
    return response.data.data;
};

/**
 * Creates a new workout session.
 * @param sessionData - The data for the new session.
 * @returns The created workout session.
 */
export const createWorkoutSession = async (sessionData: WorkoutSessionInput): Promise<IWorkoutSession> => {
    const response = await apiClient.post('/workoutsessions', sessionData);
    return response.data.data;
};