import apiClient from './apiClient';
import type { IWorkoutPlan } from '../types/workoutPlan';

const API_URL = '/workoutplans';

export interface WorkoutPlanExerciseInput {
    exercise: string;
    sets: number;
    reps: string;
}

export type WorkoutPlanInput = Omit<IWorkoutPlan, '_id' | 'user' | 'createdAt' | 'exercises'> & {
    exercises?: WorkoutPlanExerciseInput[];
};


export const getWorkoutPlans = async (): Promise<IWorkoutPlan[]> => {
    const response = await apiClient.get(API_URL);
    return response.data.data;
};

export const getWorkoutPlan = async (id: string): Promise<IWorkoutPlan> => {
    const response = await apiClient.get(`${API_URL}/${id}`);
    return response.data.data;
};

export const createWorkoutPlan = async (workoutPlanData: WorkoutPlanInput): Promise<IWorkoutPlan> => {
    const response = await apiClient.post(API_URL, workoutPlanData);
    return response.data.data;
};

export const updateWorkoutPlan = async (id: string, workoutPlanData: Partial<WorkoutPlanInput>): Promise<IWorkoutPlan> => {
    const response = await apiClient.put(`${API_URL}/${id}`, workoutPlanData);
    return response.data.data;
};

export const deleteWorkoutPlan = async (id: string): Promise<void> => {
    await apiClient.delete(`${API_URL}/${id}`);
};