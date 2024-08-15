import { Container, Button, Box, Typography, CircularProgress, Grid } from "@mui/material";
import { getDatabase, ref, onValue } from "firebase/database";
import React, { useEffect, useMemo, useState } from "react";

import UserCard from "../../components/Cards/UserCard";
import { calculateAge, UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import { getAllUsers } from "../../services/DatabaseService/getAllUsers";

interface UserModel extends UserDataModel {
	online: boolean;
}

const HomePage: React.FC = () => {
	const [users, setUsers] = useState<UserModel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { currentUser } = useAuth();

	useEffect(() => {
		const fetchUsersWithOnlineStatus = async () => {
			setLoading(true);
			setError(null);

			const response = await getAllUsers({ excludeId: currentUser?.uid });

			if (response.success && response.data) {
				const updatedUsers = await Promise.all(
					response.data.map(async (user) => {
						const userStatusRef = ref(getDatabase(), `/status/${user.uid}`);

						return new Promise<UserModel>((resolve) => {
							onValue(userStatusRef, (snapshot) => {
								const status = snapshot.val();
								resolve({
									...user,
									online: status?.online || false,
								});
							});
						});
					}),
				);

				setUsers(updatedUsers);
			} else {
				setError(response.message || "Failed to load users.");
			}

			setLoading(false);
		};

		fetchUsersWithOnlineStatus();
	}, [currentUser]);

	const handleRefresh = () => {
		setUsers([]);
		setError(null);
	};

	const renderedUsers = useMemo(
		() =>
			users.map((user) => (
				<Grid item key={user.uid}>
					<UserCard
						photoUrl={user.profilePictureUrl}
						username={user.username}
						clickable
						horizontal={false}
						age={calculateAge(user.dateOfBirth) as number}
						online={user.online}
					/>
				</Grid>
			)),
		[users],
	);

	return (
		<Container
			sx={{
				display: "flex",
				flexDirection: "column",
				paddingTop: "16px",
				paddingBottom: "16px",
				width: "100%",
				height: "100%",
				justifyContent: "flex-start",
				overflowY: "auto",
			}}
		>
			<Typography variant='h5' gutterBottom textAlign='center'>
				User List
			</Typography>
			{loading && (
				<Box display='flex' justifyContent='center' alignItems='center' mt={2}>
					<CircularProgress />
				</Box>
			)}
			{error && (
				<Typography variant='body1' color='error' textAlign='center'>
					{error}
				</Typography>
			)}
			{!loading && users.length === 0 && !error && (
				<Button variant='contained' color='secondary' onClick={handleRefresh} fullWidth>
					Refresh
				</Button>
			)}
			<Grid container spacing={2} justifyContent='center'>
				{renderedUsers}
			</Grid>
		</Container>
	);
};

export default HomePage;
