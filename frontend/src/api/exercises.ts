import apiClient from './apiClient';
import type { Exercise } from '../types/exercise';

const API_URL = '/exercises';

export interface ExerciseInput {
    name: string;
    muscleGroup: string;
}

export const getExercises = async (): Promise<Exercise[]> => {
    const response = await apiClient.get(API_URL);
    return response.data.data;
};

export const createExercise = async (exerciseData: ExerciseInput): Promise<Exercise> => {
    const response = await apiClient.post(API_URL, exerciseData);
    return response.data.data;
};

export const updateExercise = async (id: string, exerciseData: ExerciseInput): Promise<Exercise> => {
    const response = await apiClient.put(`${API_URL}/${id}`, exerciseData);
    return response.data.data;
};

export const deleteExercise = async (id: string): Promise<void> => {
    await apiClient.delete(`${API_URL}/${id}`);
};