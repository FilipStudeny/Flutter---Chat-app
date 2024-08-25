import { CircularProgress, List, Box } from "@mui/material";
import React, { useEffect, useState } from "react";

import { LoadingContainer, ErrorText } from "./styles";
import { UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import getAllFriends from "../../../services/DatabaseService/getAllFriends";
import FriendCard from "../../Cards/FriendCard";
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

	return (
		<Sidebar side={side} borderPosition={borderPosition} isOpen={isOpen} onToggle={onToggle}>
			{loading ? (
				<LoadingContainer>
					<CircularProgress />
				</LoadingContainer>
			) : error ? (
				<ErrorText>{error}</ErrorText>
			) : (
				<Box sx={{ padding: 1, width: "100%" }}>
					{" "}
					{/* Adjust padding if necessary */}
					<List sx={{ padding: 0, width: "100%" }}>
						{friends.map((friend) => (
							<Box key={friend.uid} sx={{ mb: 1, width: "100%", boxSizing: "border-box" }}>
								<FriendCard friend={friend} />
							</Box>
						))}
					</List>
				</Box>
			)}
		</Sidebar>
	);
};

export default FriendsSidebar;
