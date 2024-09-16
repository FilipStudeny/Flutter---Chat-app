import { Home, Person, Chat, Search } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import AppRoutes from "../../../constants/Enums/AppRoutes";
import { useAuth } from "../../../context/AuthenticationContext";

const BottomNav: React.FC = () => {
	const [value, setValue] = React.useState(0);
	const { currentUser } = useAuth();
	const navigate = useNavigate();

	const handleNavigationChange = (_: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
		switch (newValue) {
			case 0:
				navigate(AppRoutes.Home);
				break;
			case 1:
				navigate(AppRoutes.Profile.replace(":id", currentUser?.uid as string));
				break;
			case 2:
				navigate(AppRoutes.Search);
				break;
			case 3:
				navigate(AppRoutes.Chats);
				break;
			case 4:
				navigate(AppRoutes.Messages);
				break;
			default:
				break;
		}
	};

	return (
		<Paper
			sx={{
				position: "fixed",
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1300,
			}}
			elevation={3}
		>
			<BottomNavigation
				value={value}
				onChange={handleNavigationChange}
				showLabels
				sx={{
					backgroundColor: "#fff",
					"& .Mui-selected, & .Mui-selected .MuiBottomNavigationAction-label": {
						color: "#ff4081",
					},
					"& .MuiBottomNavigationAction-root": {
						color: "grey",
					},
					"& .MuiBottomNavigationAction-root.Mui-selected": {
						backgroundColor: "#f0f0f0",
						borderRadius: "8px",
						color: "#ff4081",
					},
					"& .MuiBottomNavigationAction-root:hover": {
						color: "#ff4081",
					},
				}}
			>
				<BottomNavigationAction label='Home' icon={<Home />} />
				<BottomNavigationAction label='Profile' icon={<Person />} />
				<BottomNavigationAction label='Search' icon={<Search />} />
				<BottomNavigationAction label='Messages' icon={<Chat />} />
			</BottomNavigation>
		</Paper>
	);
};

export default BottomNav;
