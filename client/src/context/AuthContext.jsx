import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        const token = localStorage.getItem('token');
        console.log('[AuthContext] Checking token:', token);
        if (token) {
            try {
                // Ensure default header is set if missing (just in case)
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                const { data } = await api.get('/auth/me');
                console.log('[AuthContext] /auth/me response:', data);
                if (data.success) {
                    setUser(data.user);
                } else {
                    console.warn('[AuthContext] Token invalid, clearing');
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error('[AuthContext] Auth check failed:', error);
                localStorage.removeItem('token');
            }
        } else {
            console.log('[AuthContext] No token found');
        }
        setLoading(false);
    };

    const login = async (email, password) => {
        try {
            console.log('[AuthContext] Attempting login for:', email);
            const { data } = await api.post('/auth/login', { email, password });
            console.log('[AuthContext] Login response:', data);
            if (data.success) {
                if (!data.token) {
                    console.error('[AuthContext] CRITICAL: No token in response!', data);
                } else {
                    console.log('[AuthContext] Saving token to localStorage:', data.token);
                    localStorage.setItem('token', data.token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                }
                await checkUserLoggedIn();
                return { success: true };
            }
        } catch (error) {
            console.error('[AuthContext] Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password, role = 'user') => {
        try {
            console.log('[AuthContext] Attempting register');
            const { data } = await api.post('/auth/register', { name, email, password, role });
            console.log('[AuthContext] Register response:', data);
            if (data.success) {
                if (!data.token) {
                    console.error('[AuthContext] CRITICAL: No token in response!', data);
                } else {
                    localStorage.setItem('token', data.token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
                }
                await checkUserLoggedIn();
                return { success: true };
            }
        } catch (error) {
            console.error('[AuthContext] Register failed:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
