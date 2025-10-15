import apiClient from './apiClient';
import type { User } from '../types/user';

export interface AuthResponse {
    success: boolean;
    token: string;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password?: string;
}

export interface UpdateDetailsData {
    name?: string;
    email?: string;
}

export interface UpdatePasswordData {
    currentPassword?: string;
    newPassword?: string;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
};

export const updateDetails = async (data: UpdateDetailsData): Promise<User> => {
    const response = await apiClient.put('/auth/updatedetails', data);
    return response.data.data;
};

export const updatePassword = async (data: UpdatePasswordData): Promise<AuthResponse> => {
    const response = await apiClient.put('/auth/updatepassword', data);
    return response.data;
};