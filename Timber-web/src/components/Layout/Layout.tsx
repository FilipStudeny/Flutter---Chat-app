import { Box } from "@mui/material";
import { getDatabase, ref, set } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import BottomNav from "./BottomNavigation";
import FriendsSidebar from "./FriendsSidebar"; // Import the new FriendsSidebar component
import Header from "./Header";
import { layoutContainerStyles, mainContentStyles } from "./styles";
import { useAuth } from "../../context/AuthenticationContext";

const AppLayout: React.FC = () => {
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
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
				<FriendsSidebar
					side='left'
					borderPosition='right'
					isOpen={leftSidebarOpen}
					onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
				/>

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
