import { CircularProgress, List, ListItemAvatar, Avatar, ListItemText, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
	LoadingContainer,
	ErrorText,
	StyledListItem,
	StyledButtonBase,
	UsernameText,
	OnlineStatusCircle,
} from "./styles";
import { UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import getAllFriends from "../../../services/DatabaseService/getAllFriends";
import Sidebar from "../Sidebar";

interface FriendsSidebarProps {
	side: "left" | "right";
	borderPosition: "left" | "right";
	isOpen: boolean;
	onToggle: () => void;
}

const FriendsSidebar: React.FC<FriendsSidebarProps> = ({ side, borderPosition, isOpen, onToggle }) => {
	const [friends, setFriends] = useState<UserDataModel[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const { currentUser } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriends = async () => {
			setLoading(true);
			setError(null);

			const response = await getAllFriends({ userId: currentUser?.uid });

			if (response.success && response.data) {
				setFriends(response.data);
			} else {
				setError(response.message || "Failed to load friends.");
			}

			setLoading(false);
		};

		fetchFriends();
	}, [currentUser?.uid]);

	const handleFriendClick = (friendId: string) => {
		navigate(`/profile/${friendId}`);
	};

	return (
		<Sidebar side={side} borderPosition={borderPosition} isOpen={isOpen} onToggle={onToggle}>
			{loading ? (
				<LoadingContainer>
					<CircularProgress />
				</LoadingContainer>
			) : error ? (
				<ErrorText>{error}</ErrorText>
			) : (
				<List>
					{friends.map((friend) => (
						<StyledListItem key={friend.uid}>
							<StyledButtonBase onClick={() => handleFriendClick(friend.uid as string)}>
								<ListItemAvatar>
									<Box sx={{ position: "relative", display: "inline-block" }}>
										<Avatar alt={friend.username} src={friend.profilePictureUrl} />
										<OnlineStatusCircle online={friend.onlineStatus as boolean} />
									</Box>
								</ListItemAvatar>
								<ListItemText
									primary={<UsernameText>{friend.username}</UsernameText>}
									secondary={friend.onlineStatus ? "Online" : "Offline"}
									primaryTypographyProps={{ sx: { fontWeight: "bold" } }}
									secondaryTypographyProps={{
										sx: { color: friend.onlineStatus ? "green" : "gray" },
									}}
								/>
							</StyledButtonBase>
						</StyledListItem>
					))}
				</List>
			)}
		</Sidebar>
	);
};

export default FriendsSidebar;
