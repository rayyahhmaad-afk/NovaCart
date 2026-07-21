import { createContext, useState, useEffect, useContext, useMemo } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.get('/me')
                .then(res => setUser(res.data))
                .catch(() => {
                    setToken(null);
                    setUser(null);
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (userData, userToken) => {
        if (typeof userToken === 'string') {
            // Validate & sanitize token (allow alphanumeric, dashes, underscores, dots, and pipes for Sanctum)
            const sanitizedToken = userToken.replace(/[^a-zA-Z0-9\-_\.\|]/g, '');
            setToken(sanitizedToken);
            localStorage.setItem('token', sanitizedToken);
        }
        
        // Sanitize user payload to only store required fields
        if (userData && typeof userData === 'object') {
            setUser({
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role
            });
        } else {
            setUser(userData);
        }
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error(error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        }
    };

    const value = useMemo(() => ({ user, token, login, logout, loading }), [user, token, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
