import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';
import { AppRoutes } from '../constants/Enums/AppRoutes';

const ProtectedRoute: React.FC = () => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to={`${AppRoutes.Welcome}`} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
