import axios from 'axios';
import type { IWorkoutPlan } from '../types/workoutPlan';

const API_URL = '/api/v1/workoutplans';

export interface WorkoutPlanExerciseInput {
    exercise: string;
    sets: number;
    reps: string;
}

export type WorkoutPlanInput = Omit<IWorkoutPlan, '_id' | 'user' | 'createdAt' | 'exercises'> & {
    exercises?: WorkoutPlanExerciseInput[];
};


export const getWorkoutPlans = async (token: string): Promise<IWorkoutPlan[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.data;
};

export const getWorkoutPlan = async (id: string, token: string): Promise<IWorkoutPlan> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/${id}`, config);
    return response.data.data;
};

export const createWorkoutPlan = async (workoutPlanData: WorkoutPlanInput, token: string): Promise<IWorkoutPlan> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, workoutPlanData, config);
    return response.data.data;
};

export const updateWorkoutPlan = async (id: string, workoutPlanData: Partial<WorkoutPlanInput>, token: string): Promise<IWorkoutPlan> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, workoutPlanData, config);
    return response.data.data;
};

export const deleteWorkoutPlan = async (id: string, token: string): Promise<void> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    await axios.delete(`${API_URL}/${id}`, config);
};