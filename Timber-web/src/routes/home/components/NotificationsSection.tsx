import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Typography, Card, IconButton, CircularProgress, Button } from "@mui/material";
import React, { useEffect, useState } from "react";

import UserNotification from "../../../constants/Models/UserNotification";
import loadUserNotifications from "../../../services/NotificationsService/getAllNotifications";

const NotificationsSection: React.FC<{ userId: string }> = ({ userId }) => {
	const [notifications, setNotifications] = useState<UserNotification[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchNotifications = async () => {
		setLoading(true);
		setError(null);

		try {
			const notificationsData = await loadUserNotifications(userId);
			setNotifications(notificationsData);
		} catch (error) {
			setError("Failed to load notifications.");
			console.error("Failed to load notifications:", error);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchNotifications();
	}, [userId]);

	const renderNotificationIcon = (type: string) => {
		switch (type) {
			case "message":
				return <MessageIcon />;
			case "friend_request":
				return <PersonAddIcon />;
			case "general":
			default:
				return <NotificationsIcon />;
		}
	};

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return (
			<Card sx={{ p: 2, textAlign: "center" }}>
				<Typography variant='body1' color='error'>
					{error}
				</Typography>
				<Button startIcon={<RefreshIcon />} onClick={fetchNotifications} sx={{ mt: 2 }}>
					Refresh
				</Button>
			</Card>
		);
	}

	return (
		<Box sx={{ mb: 3 }}>
			<Typography variant='h6' sx={{ display: "flex", alignItems: "center" }}>
				Notifications
				<IconButton onClick={fetchNotifications} sx={{ ml: 1 }}>
					<RefreshIcon />
				</IconButton>
			</Typography>
			{notifications.map((notification, index) => (
				<Card
					key={notification.id}
					sx={{
						mb: 2,
						p: 2,
						display: "flex",
						alignItems: "center",
						backgroundColor: index === 0 ? "#e3f2fd" : "inherit", // Highlight the newest notification
					}}
				>
					<IconButton sx={{ mr: 2 }}>{renderNotificationIcon(notification.type)}</IconButton>
					<Box>
						<Typography variant='body2'>{notification.message}</Typography>
						<Typography variant='caption' color='textSecondary'>
							{new Date(notification.createdAt.toDate()).toLocaleString()}
						</Typography>
					</Box>
				</Card>
			))}
		</Box>
	);
};

export default NotificationsSection;
