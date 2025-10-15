import axios from 'axios';

const API_URL = '/api/v1/auth';

interface AuthResponse {
    token: string;
}

interface User {
    name: string;
    email: string;
    password?: string;
}

export const login = async (credentials: Pick<User, 'email' | 'password'>): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, credentials);
    return response.data;
};

export const register = async (userData: User): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
    return response.data;
};

export const getMe = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
};