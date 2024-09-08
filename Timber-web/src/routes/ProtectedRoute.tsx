import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppRoutes from "../constants/Enums/AppRoutes";
import { useAuth } from "../context/AuthenticationContext";

const ProtectedRoute: React.FC = () => {
	const { currentUser } = useAuth();

	if (!currentUser) {
		return <Navigate to={`${AppRoutes.Welcome}`} />;
	}

	return <Outlet />;
};

export default ProtectedRoute;
