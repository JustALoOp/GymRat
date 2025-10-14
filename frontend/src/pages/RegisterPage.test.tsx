import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import RegisterPage from './RegisterPage';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RegisterPage', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('should register a user and redirect to login', async () => {
        mockedAxios.post.mockResolvedValue({});
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/auth/register', {
                name: 'testuser',
                email: 'test@example.com',
                password: 'password',
            });
        });
    });

    it('should show an error if password is too short', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /Register/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
        });

        expect(mockedAxios.post).not.toHaveBeenCalled();
    });
});