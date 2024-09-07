import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Card, IconButton, Box, Typography, Button, CircularProgress } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

import NotificationType from "../../../constants/Enums/NotificationType";
import UserNotification from "../../../constants/Models/UserNotification";
import { useAuth } from "../../../context/AuthenticationContext";
import useAddFriend from "../../../hooks/useAddFriend";
import deleteNotification from "../../../services/NotificationsService/deleteNotification";

interface NotificationCardProps {
	notification: UserNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
	const { currentUser } = useAuth();
	const { addFriendToUser, loading, error, success } = useAddFriend();

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
			await addFriendToUser(currentUser.uid, notification.senderId);

			if (success) {
				toast.success("Friend request accepted!");
				await handleDeclineFriendRequest(notification.id, true);
			} else if (error) {
				toast.error(error || "Failed to accept friend request.");
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
				maxWidth: "300px",
				mx: "auto",
				backgroundColor: "#fefefe",
				boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
				borderRadius: "16px",
				textAlign: "center",
				position: "relative",
				overflow: "hidden",
				transition: "transform 0.3s ease, box-shadow 0.3s ease",
				"&:hover": {
					transform: "translateY(-6px)",
					boxShadow: "0 10px 30px rgba(0, 0, 0, 0.12)",
				},
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 1.5, justifyContent: "center", gap: 1 }}>
				<IconButton sx={{ color: "#ff4081", backgroundColor: "#ffe6f0", p: 1, borderRadius: "50%" }}>
					{renderNotificationIcon(notification.type as NotificationType)}
				</IconButton>
				<Box>
					<Typography variant='subtitle1' sx={{ fontWeight: "bold", color: "#333", mb: 0.5 }}>
						{notification.message}
					</Typography>
					<Typography variant='caption' color='textSecondary'>
						{new Date(notification.createdAt.toDate()).toLocaleString()}
					</Typography>
				</Box>
			</Box>

			{notification.type === NotificationType.FRIEND_REQUEST && (
				<Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
					<Button
						variant='contained'
						size='small'
						onClick={handleAccept}
						sx={{
							backgroundColor: "#ff4081",
							color: "#fff",
							borderRadius: "20px",
							padding: "6px 20px",
							boxShadow: "0 4px 12px rgba(255, 64, 129, 0.2)",
							textTransform: "none",
							fontWeight: "bold",
							"&:hover": {
								backgroundColor: "#ff79b0",
								boxShadow: "0 6px 15px rgba(255, 64, 129, 0.25)",
							},
						}}
						disabled={loading} // Disable button while loading
					>
						{loading ? <CircularProgress size={20} color='inherit' /> : "Accept"}
					</Button>
					<Button
						variant='outlined'
						size='small'
						onClick={() => handleDeclineFriendRequest(notification.id)}
						sx={{
							borderColor: "#ff4081",
							color: "#ff4081",
							borderRadius: "20px",
							padding: "6px 20px",
							textTransform: "none",
							fontWeight: "bold",
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
