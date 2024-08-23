import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MessageIcon from "@mui/icons-material/Message";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Container, Box, Typography, CircularProgress, Avatar, Button, IconButton, Card } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import NotificationType from "../../constants/Enums/NotificationType"; // Ensure you have this path correct
import { getFullName, UserDataModel } from "../../constants/Models/UserDataModel";
import UserNotification from "../../constants/Models/UserNotification"; // Assuming UserNotification is the model
import { useAuth } from "../../context/AuthenticationContext";
import getAllFriends from "../../services/DatabaseService/getAllFriends";
import getAllNotifications from "../../services/NotificationsService/getAllNotifications";

const HomePage: React.FC = () => {
	const [friends, setFriends] = useState<UserDataModel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [notifications, setNotifications] = useState<UserNotification[]>([]); // State for notifications

	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriends = async () => {
			setLoading(true);
			setError(null);

			if (!currentUser?.uid) {
				setError("User not logged in");
				setLoading(false);
				return;
			}

			const response = await getAllFriends({
				userId: currentUser.uid,
			});

			if (response.success && response.data) {
				setFriends(response.data);
			} else {
				setError(response.message || "Failed to load friends.");
			}

			setLoading(false);
		};

		fetchFriends();
	}, [currentUser]);

	useEffect(() => {
		if (!currentUser?.uid) return;

		const unsubscribe = getAllNotifications(currentUser.uid, (notificationsData) => {
			setNotifications(notificationsData); // Limit to 5 notifications
		});

		return () => unsubscribe(); // Clean up the listener on component unmount
	}, [currentUser]);

	const toggleFavorite = (uid: string) => {
		setFavorites((prevFavorites) =>
			prevFavorites.includes(uid) ? prevFavorites.filter((id) => id !== uid) : [...prevFavorites, uid],
		);
	};

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

	const renderedNotifications = useMemo(
		() =>
			notifications.map((notification, index) => (
				<Card
					key={notification.id}
					sx={{
						mb: 3, // Increased margin-bottom for more space between cards
						p: 2,
						display: "flex",
						alignItems: "center",
						maxWidth: "300px", // Set max width for the notification card
						mx: "auto", // Center the card horizontally
						backgroundColor: index === 0 ? "#e3f2fd" : "#f9f9f9", // Slightly darker background for cards
						boxShadow: 2, // Add a subtle shadow for depth
						borderRadius: "12px", // Rounded corners for a modern look
					}}
				>
					<IconButton sx={{ mr: 2 }}>
						{renderNotificationIcon(notification.type as NotificationType)}
					</IconButton>
					<Box>
						<Typography variant='body2' sx={{ fontWeight: "bold" }}>
							{notification.message}
						</Typography>
						<Typography variant='caption' color='textSecondary'>
							{new Date(notification.createdAt.toDate()).toLocaleString()}
						</Typography>
					</Box>
				</Card>
			)),
		[notifications],
	);

	const renderedFriendsList = useMemo(
		() =>
			friends.map((friend) => (
				<Card
					key={friend.uid}
					sx={{
						display: "flex",
						alignItems: "center",
						borderBottom: "1px solid #e0e0e0",
						py: 2,
						px: 2,
						mb: 2,
						boxShadow: 1,
						borderRadius: 2,
						cursor: "pointer",
						transition: "box-shadow 0.3s",
						"&:hover": {
							boxShadow: 4,
						},
						backgroundColor: favorites.includes(friend.uid as string) ? "#ffe0b2" : "inherit",
					}}
					onClick={() => navigate(`/profile/${friend.uid}`)}
				>
					<Avatar src={friend.profilePictureUrl as string} sx={{ width: 60, height: 60, mr: 2 }} />
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant='h6'>{getFullName(friend)}</Typography>
						<Typography variant='body2' color='textSecondary'>
							{`Last message from ${friend.username}`}
						</Typography>
					</Box>
					<IconButton onClick={() => toggleFavorite(friend.uid as string)}>
						{favorites.includes(friend.uid as string) ? (
							<FavoriteIcon sx={{ color: "red" }} />
						) : (
							<FavoriteBorderIcon />
						)}
					</IconButton>
				</Card>
			)),
		[friends, navigate, favorites],
	);

	return (
		<Container
			sx={{
				pt: 4,
				color: "#000",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center", // Center content horizontally
			}}
		>
			{/* Notifications Section */}
			<Box sx={{ mb: 4, width: "100%" }}>
				<Typography variant='h5' align='center' sx={{ mb: 2, fontWeight: "bold" }}>
					Notifications
				</Typography>
				{renderedNotifications}
			</Box>

			{/* Friends List Section */}
			<Box sx={{ width: "100%" }}>
				<Typography variant='h5' sx={{ mb: 2, fontWeight: "bold", textAlign: "center" }}>
					Friends
				</Typography>
				{loading ? (
					<Box display='flex' justifyContent='center' alignItems='center' mt={2}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Card sx={{ p: 3, mt: 2, boxShadow: 2, textAlign: "center" }}>
						<Typography variant='body1' color='error'>
							{error}
						</Typography>
						<Button
							variant='contained'
							color='primary' // Changed button color for consistency
							onClick={() => window.location.reload()}
							sx={{ mt: 2 }}
						>
							Refresh
						</Button>
					</Card>
				) : friends.length === 0 ? (
					<Card sx={{ p: 3, mt: 2, boxShadow: 2, textAlign: "center" }}>
						<Typography variant='body1' color='textSecondary'>
							No friends found. Try refreshing the page.
						</Typography>
						<Button
							variant='contained'
							color='primary' // Changed button color for consistency
							onClick={() => window.location.reload()}
							sx={{ mt: 2 }}
						>
							Refresh
						</Button>
					</Card>
				) : (
					<Box>{renderedFriendsList}</Box>
				)}
			</Box>
		</Container>
	);
};

export default HomePage;
