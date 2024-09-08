import { Message, PersonAdd, Notifications, Delete } from "@mui/icons-material";
import { Card, Box, Typography, Button, CircularProgress, IconButton } from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

import NotificationType from "../../../constants/Enums/NotificationType";
import UserNotification from "../../../constants/Models/UserNotification";
import { useAuth } from "../../../context/AuthenticationContext";
import useAddFriend from "../../../hooks/useAddFriend";
import useDeleteNotification from "../../../hooks/useDeleteNotification";

interface NotificationCardProps {
	notification: UserNotification;
	onNotificationAction: () => void; // New prop to trigger list reload
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onNotificationAction }) => {
	const { currentUser } = useAuth();
	const { addFriendToUser, loading: addFriendLoading, error: addFriendError } = useAddFriend();
	const {
		deleteNotificationById,
		loading: deleteNotificationLoading,
		error: deleteNotificationError,
	} = useDeleteNotification();

	const handleAcceptFriendRequest = async () => {
		if (!currentUser || !notification.senderId) return;

		try {
			await addFriendToUser(currentUser.uid, notification.senderId);
			await deleteNotificationById(currentUser.uid, notification.id);
			toast.success("Friend request accepted!");
			onNotificationAction();
		} catch (error) {
			toast.error(addFriendError || "Failed to accept friend request.");
		}
	};

	const handleDeleteNotification = async () => {
		if (!currentUser) return;

		try {
			await deleteNotificationById(currentUser.uid, notification.id);
			toast.success("Notification deleted successfully!");
			onNotificationAction();
		} catch (error) {
			toast.error(deleteNotificationError || "Failed to delete notification.");
		}
	};

	const renderNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.MESSAGE:
				return <Message />;
			case NotificationType.FRIEND_REQUEST:
				return <PersonAdd />;
			case NotificationType.GLOBAL_MESSAGE:
			default:
				return <Notifications />;
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
				overflow: "hidden",
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 1.5, justifyContent: "center", gap: 1 }}>
				<IconButton
					sx={{
						color: "#ff4081",
						backgroundColor: "#ffe6f0",
						p: 1,
						borderRadius: "50%",
					}}
				>
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
				<Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
					<Button
						variant='contained'
						size='small'
						onClick={handleAcceptFriendRequest}
						sx={{
							background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
							color: "#fff",
							fontWeight: "bold",
							textTransform: "none",
							"&:hover": {
								background:
									"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
							},
						}}
						disabled={addFriendLoading}
					>
						{addFriendLoading ? <CircularProgress size={20} color='inherit' /> : "Accept"}
					</Button>
					<Button
						variant='outlined'
						size='small'
						startIcon={<Delete />}
						onClick={handleDeleteNotification}
						sx={{
							borderColor: "rgba(255,64,129,1)",
							color: "rgba(255,64,129,1)",
							fontWeight: "bold",
							textTransform: "none",
							"&:hover": {
								borderColor: "rgba(255,105,135,1)",
								color: "rgba(255,105,135,1)",
								background: "rgba(255,105,135,0.1)",
							},
						}}
						disabled={deleteNotificationLoading}
					>
						{deleteNotificationLoading ? <CircularProgress size={20} color='inherit' /> : "Delete"}
					</Button>
				</Box>
			)}
		</Card>
	);
};

export default NotificationCard;
