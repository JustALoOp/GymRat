import axios from 'axios';
import type { IWorkoutSession, WorkoutSessionInput } from '../types/workoutSession';

const API_URL = '/api/v1/workoutsessions';

export const getWorkoutSessions = async (token: string): Promise<IWorkoutSession[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.data;
};

export const createWorkoutSession = async (sessionData: WorkoutSessionInput, token: string): Promise<IWorkoutSession> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, sessionData, config);
    return response.data.data;
};