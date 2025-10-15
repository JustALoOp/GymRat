import axios from 'axios';
import type { Exercise } from '../types/exercise';

const API_URL = '/api/v1/exercises';

// Typ dla danych wejściowych przy tworzeniu/aktualizacji ćwiczenia
export interface ExerciseInput {
    name: string;
}

// Pobieranie wszystkich ćwiczeń
export const getExercises = async (token: string): Promise<Exercise[]> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.data;
};

// Tworzenie nowego ćwiczenia
export const createExercise = async (exerciseData: ExerciseInput, token: string): Promise<Exercise> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, exerciseData, config);
    return response.data.data;
};

// Aktualizacja ćwiczenia
export const updateExercise = async (id: string, exerciseData: ExerciseInput, token: string): Promise<Exercise> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${API_URL}/${id}`, exerciseData, config);
    return response.data.data;
};

// Usuwanie ćwiczenia
export const deleteExercise = async (id: string, token: string): Promise<void> => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    await axios.delete(`${API_URL}/${id}`, config);
};