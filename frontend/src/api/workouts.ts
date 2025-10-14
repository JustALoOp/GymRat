import axios from 'axios';

const API_URL = '/api/v1/workouts';

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
