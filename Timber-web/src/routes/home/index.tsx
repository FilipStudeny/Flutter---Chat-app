import { Container, Box, Typography, CircularProgress, Button, Card, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import NotificationCard from "../../components/Cards/NotificationCard";
// Updated import for the new NotificationsList component
import UserList from "../../components/Lists/UsersList";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import UserNotification from "../../constants/Models/UserNotification";
import { useAuth } from "../../context/AuthenticationContext";
import getAllFriends from "../../services/DatabaseService/getAllFriends";
import getAllNotifications from "../../services/NotificationsService/getAllNotifications";

const HomePage: React.FC = () => {
	const [friends, setFriends] = useState<UserDataModel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [notifications, setNotifications] = useState<UserNotification[]>([]); // State for notifications

	const { currentUser } = useAuth();

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
			setNotifications(notificationsData);
		});

		// eslint-disable-next-line consistent-return
		return () => unsubscribe();
	}, [currentUser]);

	return (
		<Container
			sx={{
				pt: 4,
				pb: 6,
				color: "text.primary",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Toaster position='top-right' reverseOrder={false} />
			{/* Notifications Section */}
			<Box sx={{ mb: 6, width: "100%" }}>
				<Typography variant='h5' align='center' sx={{ mb: 3, fontWeight: "bold", color: "text.secondary" }}>
					Notifications
				</Typography>
				<Divider sx={{ mb: 4 }} />

				<Grid container spacing={2} justifyContent='flex-start'>
					{notifications.slice(0, 6).map((notification) => (
						<Grid item xs={12} sm={6} md={4} key={notification.id}>
							<NotificationCard notification={notification} />
						</Grid>
					))}
				</Grid>
			</Box>

			{/* Friends List Section */}
			<Box sx={{ mb: 6, width: "100%" }}>
				<Typography variant='h5' align='center' sx={{ mb: 3, fontWeight: "bold", color: "text.secondary" }}>
					Friends
				</Typography>
				<Divider sx={{ mb: 4 }} />
				{loading ? (
					<Box display='flex' justifyContent='center' alignItems='center' mt={3}>
						<CircularProgress />
					</Box>
				) : error ? (
					<Card sx={{ p: 3, mt: 3, boxShadow: 3, textAlign: "center", backgroundColor: "#ffebee" }}>
						<Typography variant='body1' color='error'>
							{error}
						</Typography>
						<Button
							variant='contained'
							color='primary'
							onClick={() => window.location.reload()}
							sx={{ mt: 2 }}
						>
							Refresh
						</Button>
					</Card>
				) : friends.length === 0 ? (
					<Card sx={{ p: 3, mt: 3, boxShadow: 3, textAlign: "center", backgroundColor: "#e3f2fd" }}>
						<Typography variant='body1' color='textSecondary'>
							No friends found. Try refreshing the page.
						</Typography>
						<Button
							variant='contained'
							color='primary'
							onClick={() => window.location.reload()}
							sx={{ mt: 2 }}
						>
							Refresh
						</Button>
					</Card>
				) : (
					<Box>
						<UserList />
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default HomePage;
