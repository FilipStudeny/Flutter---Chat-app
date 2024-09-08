import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import AppRoutes from "../constants/Enums/AppRoutes";
import { useAuth } from "../context/AuthenticationContext";

const PublicRoute: React.FC = () => {
	const { currentUser } = useAuth();

	if (currentUser) {
		return <Navigate to={AppRoutes.Home} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
