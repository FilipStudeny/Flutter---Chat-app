import { Notifications, Message, PersonAdd, Delete } from "@mui/icons-material";
import { IconButton, Badge, Popover, Box, Typography, Button, LinearProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import NotificationType from "../../../../constants/Enums/NotificationType";
import UserNotification from "../../../../constants/Models/UserNotification";
import useListenForNotifications from "../../../../hooks/useListenForNotifications";

interface NotificationDisplayProps {
	userId: string;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ userId }) => {
	const { notifications, unreadCount, clearNotifications, markAllAsRead } = useListenForNotifications({ userId });
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
	const [progress, setProgress] = useState<number>(0);
	const navigate = useNavigate();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		markAllAsRead(); // Mark notifications as read but keep them visible
	};

	const handleClose = () => {
		setAnchorEl(null);

		if (timer) {
			clearTimeout(timer);
			setTimer(null);
		}
		setProgress(0);
	};

	const open = Boolean(anchorEl);
	const id = open ? "notification-popover" : undefined;

	useEffect(() => {
		if (open && notifications.length !== 0) {
			let progressValue = 0;
			const interval = 100;
			const totalTime = 30000;

			const progressTimer = setInterval(() => {
				progressValue += (interval / totalTime) * 100;
				setProgress(progressValue);

				if (progressValue >= 100) {
					clearNotifications();
					clearInterval(progressTimer);
				}
			}, interval);

			const newTimer = setTimeout(() => {
				clearNotifications();
				clearInterval(progressTimer);
			}, totalTime);

			setTimer(newTimer);

			return () => {
				clearTimeout(newTimer);
				clearInterval(progressTimer);
			};
		}
		return () => { };
	}, [open]);

	const handleAcceptFriendRequest = (notificationId: string) => {
		console.log("Friend request accepted:", notificationId);
	};

	const handleDeleteNotification = (notificationId: string) => {
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
				{getNotificationIcon(notification.type)}

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
							{notifications.map((notification) => renderNotificationItem(notification))}
						</Box>
					)}

					{/* Progress Bar */}
					{notifications.length !== 0 && (
						<Box sx={{ px: 2, py: 1 }}>
							<LinearProgress variant='determinate' value={progress} />
						</Box>
					)}

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
