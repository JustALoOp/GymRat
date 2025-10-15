import axios from 'axios';

const API_URL = '/api/v1/workoutsessions';

interface WorkoutData {
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
}

// Pobieranie wszystkich treningów
export const getWorkouts = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data.data;
};

// Tworzenie nowego treningu
export const createWorkout = async (workoutData: WorkoutData, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, workoutData, config);
    return response.data.data;
};

// Usuwanie treningu
export const deleteWorkout = async (id: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data.data;
};
