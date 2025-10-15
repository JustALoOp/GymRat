import apiClient from './apiClient';
import type { IWorkoutSession, WorkoutSessionInput } from '../types/workoutSession';

const API_URL = '/workoutsessions';

export const getWorkoutSessions = async (): Promise<IWorkoutSession[]> => {
    const response = await apiClient.get(API_URL);
    return response.data.data;
};

export const createWorkoutSession = async (sessionData: WorkoutSessionInput): Promise<IWorkoutSession> => {
    const response = await apiClient.post(API_URL, sessionData);
    return response.data.data;
};

export const getWorkoutSession = async (id: string): Promise<IWorkoutSession> => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data.data;
};