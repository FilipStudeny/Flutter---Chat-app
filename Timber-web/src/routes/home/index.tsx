import {
	Container,
	Button,
	Box,
	Typography,
	CircularProgress,
	Grid,
	MenuItem,
	Select,
	SelectChangeEvent,
	FormControl,
	InputLabel,
} from "@mui/material";
import { getDatabase, ref, onValue } from "firebase/database";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserCard from "../../components/Cards/UserCard";
import { Gender } from "../../constants/Enums/Gender";
import { calculateAge, getFullName, UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import getAllUsers from "../../services/DatabaseService/getAllUsers";

interface UserModel extends UserDataModel {
	online: boolean;
}

const HomePage: React.FC = () => {
	const [users, setUsers] = useState<UserModel[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedGender, setSelectedGender] = useState<Gender | "all">("all");
	const [displayMode, setDisplayMode] = useState<"grid" | "row">("grid");
	const [itemsPerRow, setItemsPerRow] = useState<number>(3);

	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUsersWithOnlineStatus = async () => {
			setLoading(true);
			setError(null);

			const response = await getAllUsers({
				excludeId: currentUser?.uid,
				gender: selectedGender !== "all" ? selectedGender : undefined,
			});

			if (response.success && response.data) {
				const updatedUsers = await Promise.all(
					response.data.map(async (user: UserDataModel) => {
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
	}, [currentUser, selectedGender]);

	const handleGenderChange = (event: SelectChangeEvent<Gender | "all">) => {
		setSelectedGender(event.target.value as Gender | "all");
	};

	const handleDisplayModeChange = (event: SelectChangeEvent<"grid" | "row">) => {
		setDisplayMode(event.target.value as "grid" | "row");
	};

	const handleItemsPerRowChange = (event: SelectChangeEvent<number>) => {
		setItemsPerRow(Number(event.target.value));
	};

	const handleRefresh = () => {
		setUsers([]);
		setError(null);
	};

	const renderedUsers = useMemo(
		() =>
			users.map((user) => (
				<Grid item key={user.uid} xs={12} sm={6} md={12 / itemsPerRow}>
					<UserCard
						photoUrl={user.profilePictureUrl as string}
						username={user.username as string}
						clickable
						horizontal={displayMode === "row"}
						age={calculateAge(user.dateOfBirth) as number}
						online={user.online}
						onClick={() => navigate(`/profile/${user.uid}`)}
						name={getFullName(user)}
						gender={user.gender as Gender}
					/>
				</Grid>
			)),
		[users, displayMode, itemsPerRow, navigate],
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
			<Typography variant="h5" gutterBottom textAlign="center">
				User List
			</Typography>
			<Box display="flex" alignItems="center" mb={2} px={2}>
				<FormControl variant="outlined" sx={{ minWidth: 150 }}>
					<InputLabel>Gender</InputLabel>
					<Select value={selectedGender} onChange={handleGenderChange} label="Gender">
						<MenuItem value="all">All</MenuItem>
						<MenuItem value={Gender.Male}>Male</MenuItem>
						<MenuItem value={Gender.Female}>Female</MenuItem>
					</Select>
				</FormControl>

				<FormControl variant="outlined" sx={{ minWidth: 150 }}>
					<InputLabel>Display Mode</InputLabel>
					<Select value={displayMode} onChange={handleDisplayModeChange} label="Display Mode">
						<MenuItem value="grid">Grid</MenuItem>
						<MenuItem value="row">Row</MenuItem>
					</Select>
				</FormControl>

				<FormControl variant="outlined" sx={{ minWidth: 150 }}>
					<InputLabel>Items per Row</InputLabel>
					<Select value={itemsPerRow} onChange={handleItemsPerRowChange} label="Items per Row">
						<MenuItem value={2}>2</MenuItem>
						<MenuItem value={3}>3</MenuItem>
						<MenuItem value={4}>4</MenuItem>
					</Select>
				</FormControl>
			</Box>
			{loading && (
				<Box display="flex" justifyContent="center" alignItems="center" mt={2}>
					<CircularProgress />
				</Box>
			)}
			{error && (
				<Typography variant="body1" color="error" textAlign="center">
					{error}
				</Typography>
			)}
			{!loading && users.length === 0 && !error && (
				<Button variant="contained" color="secondary" onClick={handleRefresh} fullWidth>
					Refresh
				</Button>
			)}
			<Grid container spacing={2} justifyContent="center">
				{renderedUsers}
			</Grid>
		</Container>
	);
};

export default HomePage;
