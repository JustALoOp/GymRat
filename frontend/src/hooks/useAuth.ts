import { useState, useEffect } from 'react';
import { getMe } from '../api/auth'; // Założenie, że ta funkcja istnieje
import type { User } from '../types/user';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            const data = await getMe();
            setUser(data);
        } catch (err) {
            setError('Failed to fetch user data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return { user, loading, error, refetch: fetchUser };
};