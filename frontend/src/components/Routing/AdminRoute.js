import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <p>Loading authentication...</p>; // Or a spinner component
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page if not logged in
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== 'admin') {
        // If logged in but not an admin, redirect to homepage
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
