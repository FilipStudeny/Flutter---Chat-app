import { Notifications, Message, PersonAdd, Delete } from "@mui/icons-material";
import { IconButton, Badge, Popover, Box, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationType from "../../../../constants/Enums/NotificationType";
import UserNotification from "../../../../constants/Models/UserNotification";
import useListenForNotifications from "../../../../hooks/useListenForNotifications";

interface NotificationDisplayProps {
	userId: string;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ userId }) => {
	const { notifications, unreadCount } = useListenForNotifications({ userId });
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const navigate = useNavigate();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "notification-popover" : undefined;

	const handleAcceptFriendRequest = (notificationId: string) => {
		// Logic to accept friend request
		console.log("Friend request accepted:", notificationId);
	};

	const handleDeleteNotification = (notificationId: string) => {
		// Logic to delete notification
		console.log("Notification deleted:", notificationId);
	};

	const getNotificationIcon = (type: NotificationType) => {
		const iconStyle = {
			background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
			borderRadius: "50%",
			color: "#fff",
			padding: "6px",
		};

		switch (type) {
			case NotificationType.MESSAGE:
				return <Message sx={{ ...iconStyle, mr: 1 }} />;
			case NotificationType.FRIEND_REQUEST:
				return <PersonAdd sx={{ ...iconStyle, mr: 1 }} />;
			case NotificationType.GLOBAL_MESSAGE:
				return <Notifications sx={{ ...iconStyle, mr: 1 }} />;
			default:
				return <Notifications sx={{ ...iconStyle, mr: 1 }} />;
		}
	};

	const renderNotificationItem = (notification: UserNotification) => (
		<Box key={notification.id} sx={{ p: 1, borderBottom: "1px solid #f0f0f0" }}>
			<Box sx={{ display: "flex", alignItems: "center" }}>
				{/* Render Icon */}
				{getNotificationIcon(notification.type)}

				{/* Notification Message and Time */}
				<Box>
					<Typography variant='body2' sx={{ fontWeight: notification.read ? "normal" : "bold" }}>
						{notification.message}
					</Typography>
					<Typography variant='caption' color='textSecondary'>
						{new Date(notification.createdAt.toDate()).toLocaleString()}
					</Typography>
				</Box>
			</Box>

			{/* If it's a friend request, show Accept and Delete buttons */}
			{notification.type === NotificationType.FRIEND_REQUEST && (
				<Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
					<Button
						variant='contained'
						size='small'
						onClick={() => handleAcceptFriendRequest(notification.id)}
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
					>
						Accept
					</Button>
					<Button
						variant='outlined'
						size='small'
						startIcon={<Delete />}
						onClick={() => handleDeleteNotification(notification.id)}
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
					>
						Delete
					</Button>
				</Box>
			)}
		</Box>
	);

	return (
		<div>
			{/* Bell Icon with Badge */}
			<IconButton
				onClick={handleClick}
				sx={{
					background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
					color: "#fff",
					borderRadius: "50%",
					padding: "10px",
					"&:hover": {
						background: "linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
					},
				}}
			>
				<Badge
					badgeContent={unreadCount}
					sx={{
						"& .MuiBadge-badge": {
							backgroundColor: "white",
							color: "rgba(255,105,135,1)",
							fontWeight: "bold",
							fontSize: "15px",
							border: "2px solid white",
						},
					}}
				>
					<Notifications sx={{ color: "#fff" }} />
				</Badge>
			</IconButton>

			{/* Popover for notifications */}
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<Box sx={{ width: "260px", maxHeight: "400px", overflowY: "auto" }}>
					{notifications.length === 0 ? (
						<Typography variant='body2' color='textSecondary' sx={{ textAlign: "center", p: 2 }}>
							No new notifications
						</Typography>
					) : (
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{/* Display each notification */}
							{notifications.map((notification) => renderNotificationItem(notification))}
						</Box>
					)}

					{/* Button to go to home page */}
					<Button
						variant='contained'
						color='primary'
						onClick={() => navigate("/")}
						fullWidth
						sx={{
							mt: 1,
							background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
							color: "#fff",
							fontWeight: "bold",
							"&:hover": {
								background:
									"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
							},
						}}
					>
						Go to Home
					</Button>
				</Box>
			</Popover>
		</div>
	);
};

export default NotificationDisplay;
