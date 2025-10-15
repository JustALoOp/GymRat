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

/**
 * Fetches a single workout session by its ID.
 * @param id - The ID of the workout session.
 * @returns The workout session.
 */
export const getWorkoutSession = async (id: string): Promise<IWorkoutSession> => {
    const response = await apiClient.get(`/workoutsessions/${id}`);
    return response.data.data;
};