import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import { register } from '../api/auth';

jest.mock('../api/auth', () => ({
    register: jest.fn(),
}));

const mockedRegister = register as jest.Mock;

describe('RegisterPage', () => {
    beforeEach(() => {
        mockedRegister.mockClear();
    });

    it('should register a user and redirect to login', async () => {
        mockedRegister.mockResolvedValue({ success: true });

        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password' } });
        fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith({
                name: 'testuser',
                email: 'test@example.com',
                password: 'password',
            });
        });
    });

    test('should show an error if passwords do not match', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: 'password456' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
        });
    });

    test('should show an error if password is too short', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: '123' } });
        fireEvent.change(screen.getByTestId('confirm-password-input'), { target: { value: '123' } });
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

        await waitFor(() => {
            expect(screen.getByText('Password must be at least 6 characters long.')).toBeInTheDocument();
        });

        expect(register).not.toHaveBeenCalled();
    });
});