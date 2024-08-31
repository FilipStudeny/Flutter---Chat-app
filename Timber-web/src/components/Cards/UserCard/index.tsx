import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Divider,
	Avatar,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	CircularProgress,
	Tooltip,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Gender } from "../../../constants/Enums/Gender";
import { calculateAge, UserDataModel } from "../../../constants/Models/UserDataModel";
import useAddFriend from "../../../hooks/useAddFriend";
import useRemoveFriend from "../../../hooks/useRemoveFriend";

interface UserCardProps {
	user: UserDataModel;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	const { isFriend, toggleFriend, loading: friendLoading } = useAddFriend(user);
	const navigate = useNavigate();

	// State for handling remove friend modal
	const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);

	const handleOpenRemoveModal = () => {
		setRemoveModalOpen(true);
	};

	const handleCloseRemoveModal = () => {
		setRemoveModalOpen(false);
	};

	const { removeFriendAction, loading: removeLoading } = useRemoveFriend(user, handleCloseRemoveModal);

	return (
		<Card
			sx={{
				boxShadow: 4,
				borderRadius: 3,
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": {
					transform: "scale(1.03)",
					boxShadow: 6,
				},
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				overflow: "hidden",
				backgroundColor: "#ffffff",
			}}
		>
			{/* Profile picture as card cover */}
			<Box
				sx={{
					width: "100%",
					height: "180px",
					overflow: "hidden",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#f0f0f0",
					borderBottom: "1px solid #e0e0e0",
				}}
			>
				<Avatar
					src={user.profilePictureUrl || "/default-profile.png"}
					alt={user.username}
					sx={{
						width: "100%",
						height: "auto",
						objectFit: "cover",
						borderRadius: 0,
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
					}}
				/>
			</Box>
			<CardContent
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					width: "100%",
					paddingTop: 3,
					paddingBottom: 2,
				}}
			>
				<Typography variant='h6' sx={{ fontWeight: "bold", textAlign: "center" }}>
					{user.firstName} {user.lastName}
				</Typography>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 0.5 }}>
					Username: {user.username}
				</Typography>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
					Age: {calculateAge(user.dateOfBirth as Date)}
				</Typography>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mt: 1,
					}}
				>
					{user.gender === Gender.Male ? (
						<MaleIcon sx={{ color: "#2196F3", fontSize: 30, mr: 1 }} />
					) : user.gender === Gender.Female ? (
						<FemaleIcon sx={{ color: "#E91E63", fontSize: 30, mr: 1 }} />
					) : null}
				</Box>
			</CardContent>
			<Divider sx={{ width: "100%", my: 1 }} />
			<Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2 }}>
				<Tooltip title={isFriend ? "Remove Friend" : "Add Friend"}>
					<IconButton
						color='primary'
						aria-label={isFriend ? "remove friend" : "add friend"}
						onClick={isFriend ? handleOpenRemoveModal : toggleFriend}
						disabled={friendLoading || removeLoading}
						sx={{
							backgroundColor: isFriend ? "#FF1053" : "#FF4081",
							color: "white",
							"&:hover": {
								backgroundColor: isFriend ? "#FF4081" : "#FF1053",
							},
						}}
					>
						{isFriend ? <PersonRemoveIcon /> : <PersonAddIcon />}
					</IconButton>
				</Tooltip>
				<Tooltip title='View Profile'>
					<IconButton
						color='primary'
						aria-label='view profile'
						sx={{
							backgroundColor: "#FF4081",
							color: "white",
							"&:hover": {
								backgroundColor: "#FF1053",
							},
						}}
						onClick={() => navigate(`/profile/${user.uid}`)}
					>
						<VisibilityIcon />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Modal for confirming friend removal */}
			<Dialog
				open={isRemoveModalOpen}
				onClose={handleCloseRemoveModal}
				PaperProps={{
					sx: {
						borderRadius: 3,
						overflow: "hidden",
						boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
					},
				}}
			>
				<DialogTitle
					sx={{
						background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
						color: "white",
						fontWeight: "bold",
						padding: "16px",
						textAlign: "center",
					}}
				>
					Confirm Remove Friend
				</DialogTitle>
				<DialogContent
					sx={{
						backgroundColor: "white",
						padding: "24px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
					}}
				>
					<Typography m={2} variant='body1' sx={{ color: "text.secondary" }}>
						Are you sure you want to remove{" "}
						<Typography component='span' sx={{ fontWeight: "bold", color: "#FF4081" }}>
							{user.firstName} {user.lastName}
						</Typography>{" "}
						from your friends list?
					</Typography>
				</DialogContent>
				<DialogActions
					sx={{
						backgroundColor: "white",
						padding: "12px 24px",
						justifyContent: "center",
					}}
				>
					<Button
						onClick={handleCloseRemoveModal}
						sx={{
							backgroundColor: "#FF4081", // Background color for Cancel button
							color: "white",
							fontWeight: "bold",
							padding: "8px 16px", // Increased padding for a larger click area
							borderRadius: "20px", // Rounded corners
							transition: "background-color 0.3s ease", // Smooth transition for hover effect
							"&:hover": {
								backgroundColor: "#E91E63", // Slightly darker shade on hover
							},
							"&:disabled": {
								backgroundColor: "#FFB6C1", // Lighter shade when disabled
							},
						}}
						disabled={removeLoading}
					>
						Cancel
					</Button>
					<Button
						onClick={removeFriendAction}
						variant='contained'
						sx={{
							backgroundColor: "white",
							color: "#FF4081",
							fontWeight: "bold",
							padding: "8px 16px", // Increased padding for a more prominent button
							marginLeft: 2,
							borderRadius: "20px", // Rounded corners
							border: "2px solid #FF4081", // Border to make it stand out
							boxShadow: "none",
							transition: "background-color 0.3s ease, color 0.3s ease", // Smooth transition for hover effect
							"&:hover": {
								backgroundColor: "#FF4081",
								color: "white",
							},
							"&:disabled": {
								backgroundColor: "#f0f0f0", // Light gray background when disabled
								color: "#FFB6C1", // Light pink color when disabled
								border: "2px solid #FFB6C1", // Border color change when disabled
							},
						}}
						disabled={removeLoading}
					>
						{removeLoading ? <CircularProgress size={24} sx={{ color: "#FF4081" }} /> : "Remove"}
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default UserCard;
