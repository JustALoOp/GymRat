import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
    render(<App />);
    const linkElement = screen.getByRole('heading', { name: /Welcome to GymRat/i });
    expect(linkElement).toBeInTheDocument();
});