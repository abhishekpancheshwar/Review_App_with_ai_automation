import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
        isAuthenticated: false,
        user: null,
        loading: true, // Start with loading true to prevent UI flicker
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                // Check if the token is expired
                if (decodedUser.exp > currentTime) {
                    // The token is valid, set the user state
                    setState({ isAuthenticated: true, user: decodedUser, loading: false });
                } else {
                    // Token is expired, remove it
                    localStorage.removeItem('token');
                    setState({ isAuthenticated: false, user: null, loading: false });
                }
            } catch (error) {
                // If token is invalid for any reason
                localStorage.removeItem('token');
                setState({ isAuthenticated: false, user: null, loading: false });
            }
        } else {
            // No token found
            setState({ isAuthenticated: false, user: null, loading: false });
        }
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', res.data.token);
        const decodedUser = jwtDecode(res.data.token);
        setState({ isAuthenticated: true, user: decodedUser, loading: false });
    };

    const register = async (name, email, password) => {
        const res = await api.post('/auth/register', { name, email, password });
        localStorage.setItem('token', res.data.token);
        const decodedUser = jwtDecode(res.data.token);
        setState({ isAuthenticated: true, user: decodedUser, loading: false });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setState({ isAuthenticated: false, user: null, loading: false });
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);