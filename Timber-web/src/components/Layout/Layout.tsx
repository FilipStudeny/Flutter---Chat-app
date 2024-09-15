import { Box } from "@mui/material";
import { getDatabase, ref, set } from "firebase/database";
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import BottomNav from "./BottomNavigation";
import Header from "./Header";
import { layoutContainerStyles, mainContentStyles } from "./styles";
import { useAuth } from "../../context/AuthenticationContext";

const AppLayout: React.FC = () => {
	const location = useLocation();
	const { currentUser } = useAuth();
	const database = getDatabase();

	useEffect(() => {
		if (currentUser) {
			const userStatusRef = ref(database, `/status/${currentUser.uid}`);
			set(userStatusRef, {
				online: true,
				last_seen: Date.now(),
				location: location.pathname,
			});
		}
	}, [location, currentUser, database]);

	return (
		<>
			<Header />

			<Box sx={layoutContainerStyles}>
				<Box component='main' sx={mainContentStyles}>
					<Box sx={{ width: "70%" }}>
						<Outlet />
					</Box>
				</Box>
			</Box>

			<BottomNav />
		</>
	);
};

export default AppLayout;
