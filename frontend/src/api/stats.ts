import axios from 'axios';

const API_URL = '/api/v1/stats';

export const getVolumeHistory = async (exerciseId: string, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/volume-history/${exerciseId}`, config);
    return response.data.data;
};