import apiClient from './apiClient';

// Interface for the response from login/register endpoints
export interface AuthResponse {
    success: boolean;
    token: string;
}

// Interface for login credentials
export interface LoginCredentials {
    email: string;
    password?: string;
}

// Interface for registration data
export interface RegisterData {
    name: string;
    email: string;
    password?: string;
}

/**
 * Logs in a user.
 * @param credentials - The user's login credentials.
 * @returns The authentication token.
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

/**
 * Registers a new user.
 * @param userData - The data for the new user.
 * @returns The authentication token.
 */
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
};

/**
 * Fetches the current logged-in user's data.
 * @param token - The user's authentication token.
 * @returns The user's data.
 */
export const getMe = async (token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await apiClient.get('/auth/me', config);
    return response.data;
};