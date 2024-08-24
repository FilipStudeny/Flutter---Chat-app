import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Card, IconButton, Box, Typography, Button } from "@mui/material";
import React from "react";

import NotificationType from "../../../constants/Enums/NotificationType";
import UserNotification from "../../../constants/Models/UserNotification";

interface NotificationCardProps {
	notification: UserNotification;
	onAcceptFriendRequest?: (id: string) => void; // Function to handle accepting friend request
	onDeclineFriendRequest?: (id: string) => void; // Function to handle declining friend request
}

const NotificationCard: React.FC<NotificationCardProps> = ({
	notification,
	onAcceptFriendRequest,
	onDeclineFriendRequest,
}) => {
	const renderNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.MESSAGE:
				return <MessageIcon />;
			case NotificationType.FRIEND_REQUEST:
				return <PersonAddIcon />;
			case NotificationType.GLOBAL_MESSAGE:
			default:
				return <NotificationsIcon />;
		}
	};

	const handleAccept = () => {
		if (onAcceptFriendRequest) {
			onAcceptFriendRequest(notification.id); // Call the accept handler if provided
		}
	};

	const handleDecline = () => {
		if (onDeclineFriendRequest) {
			onDeclineFriendRequest(notification.id); // Call the decline handler if provided
		}
	};

	return (
		<Card
			sx={{
				mb: 3,
				p: 2,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				maxWidth: "300px",
				mx: "auto",
				backgroundColor: "#f9f9f9",
				boxShadow: 2,
				borderRadius: "12px",
				textAlign: "center",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<IconButton sx={{ mr: 2 }}>{renderNotificationIcon(notification.type as NotificationType)}</IconButton>
				<Box>
					<Typography variant='body2' sx={{ fontWeight: "bold" }}>
						{notification.message}
					</Typography>
					<Typography variant='caption' color='textSecondary'>
						{new Date(notification.createdAt.toDate()).toLocaleString()}
					</Typography>
				</Box>
			</Box>

			{notification.type === NotificationType.FRIEND_REQUEST && (
				<Box sx={{ display: "flex", gap: 1, mt: 1 }}>
					<Button
						variant='contained'
						size='small'
						onClick={handleAccept}
						sx={{
							background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
							color: "#fff",
							"&:hover": {
								background:
									"linear-gradient(45deg, rgba(255,64,129,0.85) 0%, rgba(255,105,135,0.85) 100%)",
							},
						}}
					>
						Accept
					</Button>
					<Button
						variant='outlined'
						size='small'
						onClick={handleDecline}
						sx={{
							background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
							color: "#fff",
							borderColor: "transparent",
							"&:hover": {
								background:
									"linear-gradient(45deg, rgba(255,64,129,0.85) 0%, rgba(255,105,135,0.85) 100%)",
								borderColor: "transparent",
							},
						}}
					>
						Decline
					</Button>
				</Box>
			)}
		</Card>
	);
};

export default NotificationCard;
