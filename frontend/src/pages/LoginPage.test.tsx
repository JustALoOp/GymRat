import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { login } from '../api/auth';

jest.mock('../api/auth', () => ({
    login: jest.fn(),
}));

const mockedLogin = login as jest.Mock;

describe('LoginPage', () => {
    it('should login a user and redirect to dashboard', async () => {
        mockedLogin.mockResolvedValue({ token: 'test-token' });

        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password',
            });
            expect(localStorage.getItem('token')).toBe('test-token');
        });
    });
});