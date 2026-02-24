import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        console.warn('PrivateRoute: No user found, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log('PrivateRoute: User authenticated', user.email, 'Role:', user.role);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.warn('PrivateRoute: Role mismatch. Required:', allowedRoles, 'User has:', user.role);
        // If user is logged in but doesn't have the required role, redirect to home to prevent loops
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRoute;
