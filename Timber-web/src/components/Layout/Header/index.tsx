import { Person } from "@mui/icons-material";
import { AppBar, Toolbar, IconButton, Typography, Avatar, Box, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

import NotificationDisplay from "./NotificationsDisplay";
import {
	appBarStyles,
	toolbarStyles,
	profileButtonStyles,
	avatarStyles,
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

						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<IconButton color='inherit' sx={iconButtonStyles} onClick={handleProfileClick}>
								<Person />
							</IconButton>
							<NotificationDisplay userId={currentUser?.uid} />
							<Button color='inherit' onClick={logout} sx={buttonStyles}>
								Logout
							</Button>
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
