import apiClient from './apiClient';

/**
 * Fetches the volume history for a specific exercise.
 * @param exerciseId - The ID of the exercise.
 * @returns The volume history data.
 */
export const getVolumeHistory = async (exerciseId: string) => {
    const response = await apiClient.get(`/stats/volume-history/${exerciseId}`);
    return response.data.data;
};

/**
 * Fetches a list of unique exercises performed by the user.
 * @returns A list of unique exercises.
 */
export const getUniqueExercises = async () => {
    const response = await apiClient.get('/stats/unique-exercises');
    return response.data.data;
};