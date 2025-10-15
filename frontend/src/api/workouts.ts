import axios from 'axios';
import type { Workout } from '../types/workout';

const API_URL = '/api/v1/workoutsessions';

// Definicja typu dla danych wejściowych, bez _id i createdAt
export interface WorkoutInput {
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
}

// Pobieranie wszystkich treningów
export const getWorkouts = async (token: string): Promise<Workout[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.data;
};

// Tworzenie nowego treningu
export const createWorkout = async (workoutData: WorkoutInput, token: string): Promise<Workout> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, workoutData, config);
    return response.data.data;
};

// Usuwanie treningu
export const deleteWorkout = async (id: string, token: string): Promise<void> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    await axios.delete(`${API_URL}/${id}`, config);
};

// Aktualizacja treningu
export const updateWorkout = async (id: string, workoutData: Partial<WorkoutInput>, token: string): Promise<Workout> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, workoutData, config);
    return response.data.data;
};