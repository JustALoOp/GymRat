import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './LoginPage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LoginPage', () => {
    it('should login a user and redirect to dashboard', async () => {
        mockedAxios.post.mockResolvedValue({ data: { token: 'test-token' } });
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/auth/login', {
                email: 'test@example.com',
                password: 'password',
            });
            expect(localStorage.getItem('token')).toBe('test-token');
        });
    });
});