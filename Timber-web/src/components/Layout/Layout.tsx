import { Box } from "@mui/material";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import BottomNav from "./BottomNavigation";
import FriendsSidebar from "./FriendsSidebar"; // Import the new FriendsSidebar component
import Header from "./Header";
import { layoutContainerStyles, mainContentStyles } from "./styles";

const AppLayout: React.FC = () => {
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

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
