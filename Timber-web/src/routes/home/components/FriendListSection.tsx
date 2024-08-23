import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Typography, Card, Avatar, IconButton, CircularProgress, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getAllFriends from "../../../services/DatabaseService/getAllFriends";
import { getFullName, UserDataModel } from "../../../constants/Models/UserDataModel";

const FriendsListSection: React.FC<{ userId: string }> = ({ userId }) => {
	const [friends, setFriends] = useState<UserDataModel[]>([]);
	const [favorites, setFavorites] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const fetchFriends = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getAllFriends({ userId });
			if (response.success && response.data) {
				setFriends(response.data);
			} else {
				setError(response.message || "Failed to load friends.");
			}
		} catch (error) {
			setError("Failed to load friends.");
			console.error("Failed to load friends:", error);
		}

		setLoading(false);
	};

	useEffect(() => {
		fetchFriends();
	}, [userId]);

	const toggleFavorite = (uid: string) => {
		setFavorites((prevFavorites) =>
			prevFavorites.includes(uid) ? prevFavorites.filter((id) => id !== uid) : [...prevFavorites, uid],
		);
	};

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return (
			<Card sx={{ p: 2, textAlign: "center" }}>
				<Typography variant='body1' color='error'>
					{error}
				</Typography>
				<Button startIcon={<RefreshIcon />} onClick={fetchFriends} sx={{ mt: 2 }}>
					Refresh
				</Button>
			</Card>
		);
	}

	return (
		<Box>
			<Typography variant='h6' sx={{ display: "flex", alignItems: "center" }}>
				Friends
				<IconButton onClick={fetchFriends} sx={{ ml: 1 }}>
					<RefreshIcon />
				</IconButton>
			</Typography>
			{friends.map((friend) => (
				<Card
					key={friend.uid}
					sx={{
						display: "flex",
						alignItems: "center",
						borderBottom: "1px solid #e0e0e0",
						py: 2,
						px: 2,
						mb: 1,
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
			))}
		</Box>
	);
};

export default FriendsListSection;
