import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            if (parsed.id && parsed.token) {
                const rawRole = (parsed.role || 'USER').toUpperCase();
                parsed.role = rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`;
                setUser(parsed);
            } else {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        console.log('AuthContext: Attempting login for', email);
        try {
            const response = await api.post('/auth/login', { email, password });
            const data = response.data;
            console.log('AuthContext: Login successful', data.email);

            const rawRole = (data.role || 'USER').toUpperCase();
            const normalizedRole = rawRole.startsWith('ROLE_') ? rawRole : `ROLE_${rawRole}`;

            const userData = {
                id: data.id,
                email: data.email,
                token: data.token,
                name: data.username,
                role: normalizedRole
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('AuthContext: Login error', error.response?.data || error.message);
            throw error;
        }
    };

    const signup = async (userData) => {
        console.log('AuthContext: Attempting signup for', userData.email);
        try {
            const response = await api.post('/auth/signup', userData);
            console.log('AuthContext: Signup successful', response.data);
            return response.data;
        } catch (error) {
            console.error('AuthContext: Signup error', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || error.message || "Registration failed");
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const hasRole = (roles) => {
        return user && roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading, hasRole }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
