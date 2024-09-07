import { FlagOutlined, MessageOutlined, CalendarToday, Phone, Email, Person, Info } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import {
	Container,
	Typography,
	Box,
	Avatar,
	Grid,
	IconButton,
	Paper,
	Button,
	TextField,
	Dialog,
	Checkbox,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useState, ChangeEvent, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import PhotosSection from "./components/PhotoSection";
import UserList from "../../../components/Lists/UsersList";
import NotificationType from "../../../constants/Enums/NotificationType";
import { calculateAge, UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import useGetUserPhotos from "../../../hooks/useFetchUserPhotos";
import useGetUser from "../../../hooks/useGetUser";
import useUpdateProfilePicture from "../../../hooks/useUpdateProfilePicture";
import useUpdateProfile from "../../../hooks/useUpdateUserProfile";
import useUploadFile from "../../../hooks/useUploadFile";
import removeFriend from "../../../services/DatabaseService/removeFriend";
import createNotification from "../../../services/NotificationsService/createNotification";

const UserProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { currentUser, userData, setUserData } = useAuth();

	// Custom hooks to fetch user, photos, and friends
	const { user, loading: userLoading, error: userError, fetchUser } = useGetUser({ userId: id as string });
	const {
		photos: uploadedPictures,
		loading: photosLoading,
		error: photosError,
		fetchPhotos,
	} = useGetUserPhotos({ userId: id as string });

	const {
		updatePicture,
		loading: profilePictureLoading,
		error: profilePictureError,
		success: profilePictureSuccess,
	} = useUpdateProfilePicture();
	const { uploadUserFile, loading: uploadLoading, error: uploadError, success: uploadSuccess } = useUploadFile();
	const {
		updateUserProfile,
		loading: updateProfileLoading,
		error: updateProfileError,
		success: updateProfileSuccess,
	} = useUpdateProfile();

	const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [openPhotoSelectionModal, setOpenPhotoSelectionModal] = useState(false);
	const [openNewPhotoModal, setOpenNewPhotoModal] = useState(false);
	const [openManagePhotosModal, setOpenManagePhotosModal] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedUploadedPicture, setSelectedUploadedPicture] = useState<string | null>(null);
	const [updatedUserData, setUpdatedUserData] = useState<UserDataModel | null>(null);
	const [confirmRemoveFriendOpen, setConfirmRemoveFriendOpen] = useState<boolean>(false);
	const [selectedPicturesForDeletion, setSelectedPicturesForDeletion] = useState<string[]>([]);

	// Reuse `fetchUser` to reload the user data
	const reloadUserData = async () => {
		await fetchUser();
		await fetchPhotos();
	};

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUpdatedUserData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleProfileUpdate = () => {
		if (updatedUserData && userData) {
			const updatedData = {
				...updatedUserData,
				gender: userData.gender,
			};

			updateUserProfile(user?.uid as string, updatedData);
		}
	};

	const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setNewProfilePicture(event.target.files[0]);
			setSelectedUploadedPicture(null);
		}
	};

	const handleSaveNewProfilePicture = () => {
		if (newProfilePicture) {
			const fileName = `${currentUser?.uid}_${new Date().getTime()}`;
			const fileDir = `users/${currentUser?.uid}_photos`;
			uploadUserFile(newProfilePicture, fileDir, fileName);
		}
	};

	useEffect(() => {
		if (profilePictureSuccess) {
			reloadUserData();
		}
	}, [profilePictureSuccess]);

	useEffect(() => {
		if (updateProfileSuccess) {
			toast.success("Profile updated successfully!");
			setEditModalOpen(false);
			reloadUserData();
		}
	}, [updateProfileSuccess]);

	useEffect(() => {
		if (profilePictureSuccess) {
			toast.success("Profile picture updated successfully.");
			setOpenPhotoSelectionModal(false);
			reloadUserData();
		}
	}, [profilePictureSuccess]);

	useEffect(() => {
		if (uploadSuccess) {
			toast.success("Photo uploaded successfully.");
			reloadUserData();
		}
	}, [uploadSuccess]);

	useEffect(() => {
		if (profilePictureError || uploadError || updateProfileError) {
			toast.error("Something went wrong.");
		}
	}, [profilePictureError, uploadError, updateProfileError]);

	const handleNewPhotoUpload = async () => {
		if (newPhotoFile) {
			const fileName = `${currentUser?.uid}_${new Date().getTime()}`;
			const fileDir = `users/${currentUser?.uid}_photos`;

			try {
				const url = await uploadUserFile(newPhotoFile, fileDir, fileName);
				if (url) {
					await updatePicture(currentUser?.uid as string, url);
					setUserData((prevState) => ({
						...prevState,
						profilePictureUrl: url,
					}));
					toast.success("Profile picture updated successfully.");
				} else {
					toast.error("Failed to upload photo.");
				}
			} catch (err) {
				toast.error("An error occurred while uploading the photo.");
			}
		}
	};

	if (userError || photosError) {
		return <Typography color='error'>Error loading data: {userError || photosError}</Typography>;
	}

	const handleSelectUploadedPicture = (url: string) => {
		setSelectedUploadedPicture(url);
		setNewProfilePicture(null);
	};

	const handleConfirmSelectUploadedPicture = async () => {
		if (selectedUploadedPicture) {
			await updatePicture(currentUser?.uid as string, selectedUploadedPicture);
			setUpdatedUserData((prevState) => ({
				...prevState,
				profilePictureUrl: selectedUploadedPicture,
			}));
			setUserData((prevState) => ({
				...prevState,
				profilePictureUrl: selectedUploadedPicture,
			}));
		}
	};

	const handleOpenPhotoSelectionModal = () => {
		setOpenPhotoSelectionModal(true);
	};

	const handleClosePhotoSelectionModal = () => {
		setOpenPhotoSelectionModal(false);
		setNewProfilePicture(null);
		setSelectedUploadedPicture(null);
	};

	const handleCloseNewPhotoModal = () => {
		setOpenNewPhotoModal(false);
		setNewPhotoFile(null);
	};

	const handleCloseManagePhotosModal = () => {
		setOpenManagePhotosModal(false);
		setSelectedPicturesForDeletion([]);
	};

	const handleSelectPhotoForDeletion = (url: string) => {
		setSelectedPicturesForDeletion((prevSelected) =>
			prevSelected.includes(url)
				? prevSelected.filter((selectedUrl) => selectedUrl !== url)
				: [...prevSelected, url],
		);
	};

	const handleDeleteSelectedPhotos = async () => {
		// Implement the deletion logic here
	};

	const handleToggleFriend = async () => {
		if (currentUser?.uid && user?.uid) {
			try {
				if (userData?.friends?.includes(user.uid)) {
					const response = await removeFriend(currentUser.uid, user.uid);
					if (response.success) {
						toast.success("Friend removed successfully.");
					} else {
						toast.error(response.message || "Failed to remove friend.");
					}
				} else {
					const notificationResponse = await createNotification(
						currentUser.uid,
						user.uid,
						`${currentUser.displayName} has sent you a friend request.`,
						NotificationType.FRIEND_REQUEST,
					);

					if (notificationResponse.success) {
						toast.success("Friend request sent successfully.");
					} else {
						toast.error(notificationResponse.message || "Failed to send friend request notification.");
					}
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Unknown error occurred");
			}
		}
	};

	const handleOpenRemoveFriendModal = () => {
		setConfirmRemoveFriendOpen(true);
	};

	const handleCloseRemoveFriendModal = () => {
		setConfirmRemoveFriendOpen(false);
	};

	const handleConfirmRemoveFriend = async () => {
		if (currentUser?.uid && user?.uid) {
			try {
				const response = await removeFriend(currentUser.uid, user.uid);
				if (response.success) {
					toast.success("Friend removed successfully.");

					if (userData) {
						const updatedFriends = userData.friends?.filter((friendId) => friendId !== user.uid) || [];

						setUserData({
							...userData,
							friends: updatedFriends,
						});
					}

					handleCloseRemoveFriendModal();
				} else {
					toast.error(response.message || "Failed to remove friend.");
				}
			} catch (err) {
				toast.error(err instanceof Error ? err.message : "Unknown error occurred");
			}
		}
	};

	const isCurrentUserProfile = currentUser?.uid === user?.uid;

	return (
		<>
			<Toaster />
			<Container maxWidth='md'>
				<Box display='flex' flexDirection='column' alignItems='center' pt={4}>
					{/* Profile Section */}
					<Box
						sx={{
							position: "relative",
							mb: 3,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							width: "100%",
							marginBottom: isCurrentUserProfile ? 5 : 1,
						}}
					>
						{/* Profile Avatar */}
						<Avatar
							alt={`${user?.firstName} ${user?.lastName}`}
							src={user?.profilePictureUrl}
							variant='square'
							sx={{
								width: 200,
								height: 200,
								cursor: isCurrentUserProfile ? "pointer" : "default",
								boxShadow: 4,
								transition: "transform 0.3s ease, box-shadow 0.3s ease",
								"&:hover": isCurrentUserProfile
									? {
											transform: "scale(1.05)",
											boxShadow: 6,
										}
									: undefined,
							}}
							onClick={isCurrentUserProfile ? handleOpenPhotoSelectionModal : undefined}
						/>

						{/* Username and Age Display */}
						<Typography
							variant='h5'
							sx={{
								position: "absolute",
								bottom: -25,
								left: "50%",
								transform: "translateX(-50%)",
								backgroundColor: "rgba(0, 0, 0, 0.6)",
								color: "#fff",
								padding: "8px 16px",
								borderRadius: "16px",
								boxShadow: 2,
								fontWeight: "bold",
								width: "auto",
								textAlign: "center",
								fontSize: "1.2rem",
							}}
						>
							{user?.username}, {calculateAge(user?.dateOfBirth)}
						</Typography>
					</Box>

					{/* Action Buttons Section */}
					{!isCurrentUserProfile && (
						<Box
							component={Paper}
							elevation={4}
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								gap: 2,
								p: 3,
								mt: 3,
								mb: 3,
								borderRadius: 2,
								boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
								backgroundColor: "#fff",
								width: "100%",
								mx: "auto", // Center horizontally
							}}
						>
							{/* Add/Remove Friend Button */}
							<Button
								variant='contained'
								color='primary'
								startIcon={
									userData?.friends?.includes(user?.uid as string) ? (
										<RemoveCircleOutlineIcon />
									) : (
										<PersonAddIcon />
									)
								}
								onClick={
									userData?.friends?.includes(user?.uid as string)
										? handleOpenRemoveFriendModal
										: handleToggleFriend
								}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									width: "100%",
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								{userData?.friends?.includes(user?.uid as string) ? "Remove Friend" : "Add Friend"}
							</Button>

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
									<DialogContentText sx={{ color: "#555", fontSize: "1rem", marginBottom: 2 }}>
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

							{/* Send Message Button */}
							<Button
								variant='outlined'
								color='primary'
								startIcon={<MessageOutlined />}
								sx={{
									width: "100%",
									color: "#ff4081",
									borderColor: "#ff4081",
									"&:hover": {
										backgroundColor: "rgba(255, 64, 129, 0.1)",
										borderColor: "#ff4081",
									},
								}}
							>
								Send Message
							</Button>

							{/* Report User Button */}
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<FlagOutlined />}
								sx={{
									width: "100%",
									color: "#f44336",
									borderColor: "#f44336",
									"&:hover": {
										backgroundColor: "rgba(244, 67, 54, 0.1)",
										borderColor: "#f44336",
									},
								}}
							>
								Report User
							</Button>
						</Box>
					)}

					{userLoading ? (
						<Box display='flex' justifyContent='center' alignItems='center' minHeight='30vh'>
							<CircularProgress />
						</Box>
					) : (
						<>
							{/* User Information Section */}
							<Box
								sx={{
									p: 3,
									width: "100%",
									borderRadius: 4,
									boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
									mb: 4,
								}}
							>
								<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
									<Typography variant='h6' fontWeight='bold' color='textPrimary'>
										User Information
									</Typography>
									{isCurrentUserProfile && (
										<IconButton onClick={() => setEditModalOpen(true)} size='large'>
											<EditIcon />
										</IconButton>
									)}
								</Box>

								{/* User Info Grid */}
								<Grid container spacing={3}>
									{/* Name */}
									<Grid item xs={12} sm={6}>
										<Box display='flex' alignItems='center'>
											<Avatar alt='Name Icon' sx={{ bgcolor: "#3f51b5", mr: 2 }}>
												<Person />
											</Avatar>
											<Box>
												<Typography variant='body2' color='textSecondary'>
													<strong>Name</strong>
												</Typography>
												<Typography variant='body1' color='textPrimary'>
													{user?.firstName} {user?.lastName}
												</Typography>
											</Box>
										</Box>
									</Grid>

									{/* Email */}
									<Grid item xs={12} sm={6}>
										<Box display='flex' alignItems='center'>
											<Avatar alt='Email Icon' sx={{ bgcolor: "#ff4081", mr: 2 }}>
												<Email />
											</Avatar>
											<Box>
												<Typography variant='body2' color='textSecondary'>
													<strong>Email</strong>
												</Typography>
												<Typography variant='body1' color='textPrimary'>
													{user?.email}
												</Typography>
											</Box>
										</Box>
									</Grid>

									{/* Phone */}
									<Grid item xs={12} sm={6}>
										<Box display='flex' alignItems='center'>
											<Avatar alt='Phone Icon' sx={{ bgcolor: "#4caf50", mr: 2 }}>
												<Phone />
											</Avatar>
											<Box>
												<Typography variant='body2' color='textSecondary'>
													<strong>Phone</strong>
												</Typography>
												<Typography variant='body1' color='textPrimary'>
													{user?.phoneNumber || "N/A"}
												</Typography>
											</Box>
										</Box>
									</Grid>

									{/* Gender */}
									<Grid item xs={12} sm={6}>
										<Box display='flex' alignItems='center'>
											<Avatar alt='Gender Icon' sx={{ bgcolor: "#ffd08a", mr: 2 }}>
												{(user?.gender as string) === "male" ? (
													<MaleIcon sx={{ color: "#2196F3", fontSize: 30 }} />
												) : (
													<FemaleIcon sx={{ color: "#E91E63", fontSize: 30 }} />
												)}
											</Avatar>
											<Box>
												<Typography variant='body2' color='textSecondary'>
													<strong>Gender</strong>
												</Typography>
												<Typography variant='body1' color='textPrimary'>
													{(user?.gender as string) === "male" ? "Male" : "Female"}
												</Typography>
											</Box>
										</Box>
									</Grid>

									{/* Date of Birth */}
									<Grid item xs={12} sm={6}>
										<Box display='flex' alignItems='center'>
											<Avatar alt='DOB Icon' sx={{ bgcolor: "#9c27b0", mr: 2 }}>
												<CalendarToday />
											</Avatar>
											<Box>
												<Typography variant='body2' color='textSecondary'>
													<strong>Date of Birth</strong>
												</Typography>
												<Typography variant='body1' color='textPrimary'>
													{user?.dateOfBirth ? user.dateOfBirth.toLocaleDateString() : "N/A"}
												</Typography>
											</Box>
										</Box>
									</Grid>
								</Grid>
							</Box>

							{/* About Me Section */}
							<Box
								sx={{
									p: 3,
									width: "100%",
									borderRadius: 4,
									boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
									mb: 4,
								}}
							>
								<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
									<Box display='flex' alignItems='center'>
										<Avatar sx={{ bgcolor: "#ff7043", mr: 2 }}>
											<Info />
										</Avatar>
										<Typography variant='h6' fontWeight='bold' color='textPrimary'>
											About Me
										</Typography>
									</Box>

									{isCurrentUserProfile && (
										<IconButton onClick={() => setEditModalOpen(true)} size='large'>
											<EditIcon />
										</IconButton>
									)}
								</Box>

								<Typography variant='body1' color='textPrimary' mt={2} sx={{ whiteSpace: "pre-wrap" }}>
									{user?.aboutMe || (
										<Typography variant='body2' color='textSecondary' fontStyle='italic'>
											No information provided.
										</Typography>
									)}
								</Typography>
							</Box>
						</>
					)}
				</Box>

				{/* Photos Section with separate photosLoading spinner */}
				<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
					{photosLoading ? (
						<Box display='flex' justifyContent='center' alignItems='center' minHeight='30vh'>
							<CircularProgress />
						</Box>
					) : (
						<PhotosSection
							isCurrentUserProfile={isCurrentUserProfile}
							uploadedPictures={uploadedPictures}
							reloadUserData={reloadUserData}
						/>
					)}
				</Paper>

				{/* Friends List Section */}
				<Box sx={{ mb: 6, width: "100%" }}>
					<UserList fetchFriends userId={id} excludeId={id} />
				</Box>

				{/* Modals */}
				{/* Edit Profile Modal */}
				<Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} fullWidth maxWidth='sm'>
					<Box sx={{ p: 4 }}>
						<Typography variant='h6' gutterBottom>
							Edit Profile
						</Typography>
						<TextField
							label='Username'
							name='username'
							value={user?.username}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='First Name'
							name='firstName'
							value={user?.firstName}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='Last Name'
							name='lastName'
							value={user?.lastName}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='Email'
							name='email'
							value={user?.email}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<TextField
							label='Phone Number'
							name='phoneNumber'
							value={user?.phoneNumber}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label='Select Date of Birth'
								value={user?.dateOfBirth ? dayjs(user.dateOfBirth) : null}
								onChange={(date) => {
									if (updatedUserData && date) {
										updatedUserData.dateOfBirth = date.toDate();
										setUpdatedUserData({ ...updatedUserData });
									}
								}}
								slotProps={{
									textField: {
										fullWidth: true,
										margin: "normal",
									},
								}}
							/>
						</LocalizationProvider>
						<TextField
							label='About Me'
							name='aboutMe'
							value={user?.aboutMe || ""}
							onChange={handleInputChange}
							fullWidth
							margin='normal'
						/>
						<Box display='flex' justifyContent='space-between' mt={2}>
							<Button
								onClick={() => setEditModalOpen(false)}
								variant='outlined'
								sx={{
									marginBottom: "1.5rem",
									padding: "10px 20px",
									fontSize: "1rem",
									borderColor: "rgba(255,64,129,1)",
									color: "rgba(255,64,129,1)",
									transition: "all 0.3s ease",
									"&:hover": {
										borderColor: "rgba(255,105,135,1)",
										color: "rgba(255,105,135,1)",
										backgroundColor: "rgba(255,64,129,0.1)",
									},
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={handleProfileUpdate}
								disabled={updateProfileLoading}
								startIcon={updateProfileLoading ? <CircularProgress size={24} /> : <SaveIcon />}
								sx={{
									marginBottom: "1.5rem",
									padding: "10px 20px",
									fontSize: "1rem",
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "#fff",
									cursor: "pointer",
									"&:hover": {
										backgroundColor: "#FF4081",
									},
									"&:disabled": {
										background: "rgba(255,105,135, 0.5)",
										color: "rgba(255, 255, 255, 0.7)",
									},
								}}
							>
								{updateProfileLoading ? "Saving..." : "Save"}
							</Button>
						</Box>
					</Box>
				</Dialog>

				{/* Modal for selecting and uploading new profile picture */}
				<Dialog open={openPhotoSelectionModal} onClose={handleClosePhotoSelectionModal} fullWidth maxWidth='sm'>
					<Box sx={{ p: 4, textAlign: "center" }}>
						<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
							<Typography variant='h6' sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
								Change Profile Picture
							</Typography>
							<IconButton onClick={handleClosePhotoSelectionModal}>
								<CloseIcon />
							</IconButton>
						</Box>

						<input
							accept='image/*'
							style={{ display: "none" }}
							id='upload-profile-picture'
							type='file'
							onChange={handleProfilePictureChange}
						/>
						<label htmlFor='upload-profile-picture'>
							<Button
								variant='contained'
								component='span'
								startIcon={profilePictureLoading ? <CircularProgress size={24} /> : <CloudUploadIcon />}
								disabled={profilePictureLoading}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									width: "100%",
									mb: 3,
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								{profilePictureLoading ? "Uploading..." : "Upload New Picture"}
							</Button>
						</label>

						{(newProfilePicture || selectedUploadedPicture) && (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mb: 2,
									overflow: "hidden",
								}}
							>
								<img
									src={
										newProfilePicture
											? (URL.createObjectURL(newProfilePicture) as string)
											: (selectedUploadedPicture as string)
									}
									alt='Selected'
									style={{
										width: "120px",
										height: "120px",
										objectFit: "cover",
									}}
								/>
							</Box>
						)}

						{newProfilePicture && (
							<Box display='flex' justifyContent='space-between' gap={2} mb={2}>
								<Button
									variant='outlined'
									color='secondary'
									startIcon={<RemoveCircleOutlineIcon />}
									onClick={() => setNewProfilePicture(null)}
									sx={{
										flex: 1,
										color: "#f44336",
										borderColor: "#f44336",
										"&:hover": {
											backgroundColor: "rgba(244, 67, 54, 0.1)",
											borderColor: "#f44336",
										},
									}}
								>
									Remove
								</Button>
								<Button
									variant='contained'
									color='primary'
									startIcon={<SaveIcon />}
									onClick={handleSaveNewProfilePicture}
									sx={{
										flex: 1,
										background:
											"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
										color: "white",
										"&:hover": {
											background:
												"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
										},
									}}
								>
									Save
								</Button>
							</Box>
						)}

						{selectedUploadedPicture && !newProfilePicture && (
							<Button
								variant='contained'
								color='primary'
								startIcon={<SaveIcon />}
								onClick={handleConfirmSelectUploadedPicture}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									width: "100%",
									mb: 2,
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								Select Profile Picture
							</Button>
						)}

						<Typography
							variant='h6'
							mt={3}
							mb={2}
							gutterBottom
							sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
						>
							Choose from Uploaded Pictures
						</Typography>
						<Grid container spacing={2} justifyContent='center'>
							{uploadedPictures.map((picture) => (
								<Grid item key={picture.name || picture.url}>
									<Box
										sx={{
											width: 70,
											height: 70,
											overflow: "hidden",
											"&:hover": { borderColor: "#ff4081" },
											boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
											cursor: "pointer",
										}}
										onClick={() => handleSelectUploadedPicture(picture.url)}
									>
										<img
											src={picture.url}
											alt='Uploaded'
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									</Box>
								</Grid>
							))}
						</Grid>
					</Box>
				</Dialog>

				{/* Modal for uploading new photo */}
				<Dialog open={openNewPhotoModal} onClose={handleCloseNewPhotoModal} fullWidth maxWidth='sm'>
					<Box sx={{ p: 4, textAlign: "center" }}>
						<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
							<Typography variant='h6' sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
								Upload New Photo
							</Typography>
							<IconButton onClick={handleCloseNewPhotoModal}>
								<CloseIcon />
							</IconButton>
						</Box>

						<input
							accept='image/*'
							style={{ display: "none" }}
							id='upload-new-photo'
							type='file'
							onChange={(e) => setNewPhotoFile(e.target.files ? e.target.files[0] : null)}
						/>
						<label htmlFor='upload-new-photo'>
							<Button
								variant='contained'
								component='span'
								startIcon={<CloudUploadIcon />}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									width: "100%",
									mb: 3,
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								Select Photo
							</Button>
						</label>

						{newPhotoFile && (
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									mb: 2,
									overflow: "hidden",
								}}
							>
								<img
									src={URL.createObjectURL(newPhotoFile)}
									alt='New'
									style={{
										width: "120px",
										height: "120px",
										objectFit: "cover",
									}}
								/>
							</Box>
						)}

						{newPhotoFile && (
							<Button
								variant='contained'
								startIcon={uploadLoading ? <CircularProgress size={24} /> : <SaveIcon />}
								onClick={handleNewPhotoUpload}
								disabled={uploadLoading}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									width: "100%",
									mb: 2,
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								{uploadLoading ? "Uploading..." : "Upload Photo"}
							</Button>
						)}
					</Box>
				</Dialog>

				{/* Modal for managing photos */}
				<Dialog open={openManagePhotosModal} onClose={handleCloseManagePhotosModal} fullWidth maxWidth='sm'>
					<Box sx={{ p: 4, textAlign: "center" }}>
						<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
							<Typography variant='h6' sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
								Manage Photos
							</Typography>
							<IconButton onClick={handleCloseManagePhotosModal}>
								<CloseIcon />
							</IconButton>
						</Box>

						<Grid container spacing={2} justifyContent='center'>
							{uploadedPictures.map((picture) => (
								<Grid item key={picture.name || picture.url}>
									<Box
										sx={{
											width: 120,
											height: 120,
											position: "relative",
											overflow: "hidden",
											boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
											cursor: "pointer",
											border: selectedPicturesForDeletion.includes(picture.url)
												? "2px solid #f44336"
												: "none",
										}}
										onClick={() => handleSelectPhotoForDeletion(picture.url)}
									>
										<img
											src={picture.url}
											alt='Manage'
											style={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
												filter: selectedPicturesForDeletion.includes(picture.url)
													? "brightness(70%)"
													: "none",
											}}
										/>
										{selectedPicturesForDeletion.includes(picture.url) && (
											<Checkbox
												checked
												sx={{
													position: "absolute",
													top: 0,
													right: 0,
													color: "#f44336",
													bgcolor: "white",
												}}
											/>
										)}
									</Box>
								</Grid>
							))}
						</Grid>

						<Box mt={3} display='flex' justifyContent='space-between'>
							<Button variant='outlined' color='secondary' onClick={handleCloseManagePhotosModal}>
								Cancel
							</Button>
							<Button
								variant='contained'
								color='primary'
								startIcon={<DeleteIcon />}
								onClick={handleDeleteSelectedPhotos}
								disabled={selectedPicturesForDeletion.length === 0}
								sx={{
									bgcolor: "#f44336",
									color: "white",
									"&:hover": {
										bgcolor: "#d32f2f",
									},
								}}
							>
								Delete Selected
							</Button>
						</Box>
					</Box>
				</Dialog>
			</Container>
		</>
	);
};

export default UserProfilePage;
