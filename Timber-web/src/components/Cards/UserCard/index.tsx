import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Divider,
	Avatar,
	IconButton,
	Tooltip,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Gender } from "../../../constants/Enums/Gender";
import NotificationType from "../../../constants/Enums/NotificationType";
import { calculateAge, UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import { useCreateNotification, useRemoveFriend, useCheckFriendRequest, useDeleteNotification } from "../../../hooks";

interface UserCardProps {
	user: UserDataModel;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
	const { currentUser, userData, setUserData } = useAuth();
	const navigate = useNavigate();

	const { removeFriendAction, loading: removeFriendLoading, error: removeFriendError } = useRemoveFriend();
	const { sendNotification, loading: notificationLoading, error: notificationError } = useCreateNotification();
	const {
		checkNotification,
		loading: checkLoading,
		notificationExists,
		notificationId,
	} = useCheckFriendRequest({
		senderId: currentUser?.uid as string,
		recipientId: user.uid as string,
		senderName: currentUser?.displayName as string,
	});
	const { deleteNotificationById, loading: deleteNotificationLoading } = useDeleteNotification();

	const [isFriend, setIsFriend] = useState<boolean>(!!userData?.friends?.includes(user?.uid as string));
	const [confirmRemoveFriendOpen, setConfirmRemoveFriendOpen] = useState<boolean>(false);

	const handleCloseRemoveFriendModal = () => {
		setConfirmRemoveFriendOpen(false);
	};

	useEffect(() => {
		checkNotification();
	}, [checkNotification]);

	useEffect(() => {
		if (notificationError) {
			toast.error("Failed to send friend request. Please try again.");
		}
		if (removeFriendError) {
			toast.error("Failed to remove friend.");
		}
	}, [notificationError, removeFriendError]);

	const handleToggleFriend = async () => {
		if (currentUser?.uid && user?.uid) {
			if (isFriend) {
				setConfirmRemoveFriendOpen(true);
				return;
			}

			const message = `${currentUser.displayName} has sent you a friend request.`;
			const notificationExists = await checkNotification();

			if (notificationExists && notificationId) {
				const response = await deleteNotificationById(user.uid, notificationId);

				if (response.success) {
					toast.success("Friend request canceled.");
					await checkNotification();
				} else {
					toast.error(response.message || "Failed to cancel friend request.");
				}
				return;
			}

			try {
				await sendNotification(currentUser.uid, user.uid, message, NotificationType.FRIEND_REQUEST);
				toast.success("Friend request sent successfully.");
				await checkNotification();
			} catch (error) {
				toast.error(notificationError || "Failed to send friend request.");
			}
		}
	};

	const handleConfirmRemoveFriend = async () => {
		if (currentUser?.uid && user?.uid) {
			try {
				await removeFriendAction(currentUser.uid, user.uid);

				if (notificationId) {
					const response = await deleteNotificationById(user.uid, notificationId);
					if (response.success) {
						toast.success("Notification removed successfully.");
					} else {
						toast.error(response.message || "Failed to remove the notification.");
					}
				}

				if (userData) {
					const updatedFriends = userData.friends?.filter((friendId) => friendId !== user.uid) || [];
					setUserData({
						...userData,
						friends: updatedFriends,
					});
				}

				toast.success("Friend removed successfully.");
				setIsFriend(false);
				handleCloseRemoveFriendModal();
			} catch (error) {
				toast.error(removeFriendError || "Failed to remove friend.");
			}
		}
	};

	return (
		<Card
			sx={{
				boxShadow: 4,
				borderRadius: 3,
				transition: "transform 0.2s, box-shadow 0.2s",
				"&:hover": { transform: "scale(1.03)", boxShadow: 6 },
			}}
		>
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
				<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 1 }}>
					{user.gender === Gender.Male ? (
						<MaleIcon sx={{ color: "#2196F3", fontSize: 30, mr: 1 }} />
					) : user.gender === Gender.Female ? (
						<FemaleIcon sx={{ color: "#E91E63", fontSize: 30, mr: 1 }} />
					) : null}
				</Box>
			</CardContent>
			<Divider sx={{ width: "100%", my: 1 }} />
			<Box sx={{ display: "flex", justifyContent: "center", gap: 1, p: 2 }}>
				{/* Add/Remove Friend Button */}
				<Tooltip
					title={isFriend ? "Remove Friend" : notificationExists ? "Cancel Friend Request" : "Add Friend"}
				>
					<IconButton
						color='primary'
						onClick={handleToggleFriend}
						disabled={
							removeFriendLoading || notificationLoading || checkLoading || deleteNotificationLoading
						}
						sx={{
							backgroundColor: isFriend || notificationExists ? "#FF4081" : "#2196F3",
							color: "white",
							"&:hover": {
								backgroundColor: isFriend || notificationExists ? "#FF1053" : "#FF4081",
							},
						}}
					>
						{removeFriendLoading || notificationLoading || checkLoading ? (
							<CircularProgress size={24} sx={{ color: "white" }} />
						) : isFriend || notificationExists ? (
							<RemoveCircleOutlineIcon />
						) : (
							<PersonAddIcon />
						)}
					</IconButton>
				</Tooltip>

				{/* View Profile Button */}
				<Tooltip title='View Profile'>
					<IconButton
						color='primary'
						sx={{ backgroundColor: "#FF4081", color: "white", "&:hover": { backgroundColor: "#FF1053" } }}
						onClick={() => navigate(`/profile/${user.uid}`)}
					>
						<VisibilityIcon />
					</IconButton>
				</Tooltip>
			</Box>

			{/* Modal for confirming friend removal */}
			<Dialog
				open={confirmRemoveFriendOpen}
				onClose={handleCloseRemoveFriendModal}
				fullWidth
				maxWidth='xs'
				PaperProps={{
					sx: {
						borderRadius: 4,
						padding: 2,
						backgroundColor: "#fff3f8",
						boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
					},
				}}
			>
				<DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#d81b60" }}>
					Remove Friend
				</DialogTitle>
				<DialogContent sx={{ textAlign: "center", paddingY: 2 }}>
					<DialogContentText sx={{ color: "#555", fontSize: "1rem", marginBottom: 2 }} component='div'>
						Are you sure you want to remove{" "}
						<strong>
							{user?.firstName} {user?.lastName}
						</strong>{" "}
						from your friends?
					</DialogContentText>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "center", paddingX: 3 }}>
					<Button
						onClick={handleCloseRemoveFriendModal}
						variant='outlined'
						sx={{
							borderColor: "#ff4081",
							color: "#ff4081",
							paddingX: 3,
							"&:hover": {
								backgroundColor: "rgba(255, 64, 129, 0.1)",
								borderColor: "#ff4081",
							},
						}}
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmRemoveFriend}
						variant='contained'
						sx={{
							backgroundColor: "#ff4081",
							color: "#fff",
							paddingX: 3,
							marginLeft: 2,
							"&:hover": {
								backgroundColor: "#d81b60",
							},
						}}
					>
						Remove
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

export default UserCard;
