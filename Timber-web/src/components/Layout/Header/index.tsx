import { Search, Notifications, Settings, Person } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography, Badge, Avatar, InputBase, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import {
	appBarStyles,
	toolbarStyles,
	profileButtonStyles,
	avatarStyles,
	searchBoxStyles,
	searchIconStyles,
	inputBaseStyles,
	buttonStyles,
	iconButtonStyles,
} from "./styles";
import { useAuth } from "../../../context/AuthenticationContext";

const Header: React.FC = () => {
	const navigate = useNavigate();
	const { currentUser, logout, userData } = useAuth();

	const handleProfileClick = () => {
		navigate(`/profile/${currentUser?.uid}`);
	};

	return (
		<AppBar position='fixed' sx={appBarStyles}>
			<Toolbar sx={toolbarStyles}>
				{currentUser ? (
					<>
						<Button color='inherit' onClick={handleProfileClick} sx={profileButtonStyles}>
							<Avatar alt='User Name' src={userData?.profilePictureUrl} sx={avatarStyles} />
							<Typography variant='h6' component='span' sx={{ fontWeight: "bold", fontSize: "1rem" }}>
								{currentUser?.email}
							</Typography>
						</Button>

						<Box sx={searchBoxStyles}>
							<Search sx={searchIconStyles} />
							<InputBase placeholder='Search…' sx={inputBaseStyles} />
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Button color='inherit' onClick={logout} sx={buttonStyles}>
								Logout
							</Button>
							<IconButton color='inherit' sx={iconButtonStyles}>
								<Settings />
							</IconButton>
							<IconButton color='inherit' sx={iconButtonStyles}>
								<Person />
							</IconButton>
							<IconButton color='inherit' sx={iconButtonStyles}>
								<Badge badgeContent={1} color='secondary'>
									<Notifications />
								</Badge>
							</IconButton>
						</Box>
					</>
				) : (
					<Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}>
						<Button color='inherit' onClick={() => navigate("/signin")} sx={buttonStyles}>
							Sign In
						</Button>
						<Button color='inherit' onClick={() => navigate("/signup")} sx={buttonStyles}>
							Sign Up
						</Button>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
