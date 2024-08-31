import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Card, IconButton, Box, Typography, Button } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

import NotificationType from "../../../constants/Enums/NotificationType";
import UserNotification from "../../../constants/Models/UserNotification";
import { useAuth } from "../../../context/AuthenticationContext";
import addFriend from "../../../services/DatabaseService/addFriend";
import deleteNotification from "../../../services/NotificationsService/deleteNotification";

interface NotificationCardProps {
	notification: UserNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
	const { currentUser } = useAuth();

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

	const handleDeclineFriendRequest = async (notificationId: string, fromAccept: boolean = false) => {
		if (!currentUser) {
			toast.error("User not authenticated.");
			return;
		}

		try {
			const response = await deleteNotification(currentUser.uid, notificationId);
			if (response.success && fromAccept === false) {
				toast.success("Notification deleted successfully.");
			} else {
				toast.error(response.message || "Failed to delete notification.");
			}
		} catch (error) {
			toast.error("An error occurred while deleting the notification.");
		}
	};

	const handleAccept = async () => {
		if (currentUser && notification.senderId) {
			try {
				const response = await addFriend(currentUser.uid, notification.senderId);
				if (response.success) {
					toast.success("Friend request accepted!");
					await handleDeclineFriendRequest(notification.id, true);
				} else {
					toast.error(response.message || "Failed to accept friend request.");
				}
			} catch (error) {
				toast.error("An error occurred while accepting the friend request.");
			}
		}
	};

	return (
		<Card
			sx={{
				mb: 2,
				p: 2,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				maxWidth: "260px",
				mx: "auto",
				backgroundColor: "#ffffff",
				boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
				borderRadius: "15px",
				textAlign: "center",
				position: "relative",
				overflow: "hidden",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "translateY(-8px)",
					boxShadow: "0 12px 35px rgba(0, 0, 0, 0.15)",
				},
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
				<IconButton sx={{ mr: 1.5, color: "#ff4081" }}>
					{renderNotificationIcon(notification.type as NotificationType)}
				</IconButton>
				<Box>
					<Typography variant='body2' sx={{ fontWeight: "bold", color: "#333" }}>
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
							backgroundColor: "#ff4081",
							color: "#fff",
							borderRadius: "20px",
							padding: "4px 16px",
							boxShadow: "0 4px 10px rgba(255, 64, 129, 0.2)",
							textTransform: "none",
							transition: "background-color 0.3s ease, box-shadow 0.3s ease",
							"&:hover": {
								backgroundColor: "#ff79b0",
								boxShadow: "0 6px 15px rgba(255, 64, 129, 0.25)",
							},
						}}
					>
						Accept
					</Button>
					<Button
						variant='outlined'
						size='small'
						onClick={() => handleDeclineFriendRequest(notification.id)}
						sx={{
							borderColor: "#ff4081",
							color: "#ff4081",
							borderRadius: "20px",
							padding: "4px 16px",
							textTransform: "none",
							transition: "border-color 0.3s ease, color 0.3s ease",
							"&:hover": {
								borderColor: "#ff79b0",
								color: "#ff79b0",
								backgroundColor: "rgba(255, 64, 129, 0.08)",
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
