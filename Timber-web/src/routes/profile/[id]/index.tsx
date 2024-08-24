import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import PhotosSection from "./components/PhotoSection";
import FriendsList from "../../../components/Lists/FriendList";
import NotificationType from "../../../constants/Enums/NotificationType";
import { calculateAge, UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import getAllFriends from "../../../services/DatabaseService/getAllFriends";
import getUser from "../../../services/DatabaseService/getUser";
import updateProfile from "../../../services/DatabaseService/updateProfile";
import updateProfilePicture from "../../../services/DatabaseService/updateProfilePicture";
import getUserPhotos from "../../../services/FileStorageService/getUserPhotos";
import { FileMetadata, uploadFile } from "../../../services/FileStorageService/uploadFile";
import createNotification from "../../../services/NotificationsService/createNotification";

const UserProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { currentUser } = useAuth();

	const [user, setUser] = useState<UserDataModel | null>(null);
	const [uploadedPictures, setUploadedPictures] = useState<FileMetadata[]>([]);
	const [selectedPicturesForDeletion, setSelectedPicturesForDeletion] = useState<string[]>([]);
	const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [openPhotoSelectionModal, setOpenPhotoSelectionModal] = useState(false);
	const [openNewPhotoModal, setOpenNewPhotoModal] = useState(false);
	const [openManagePhotosModal, setOpenManagePhotosModal] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedUploadedPicture, setSelectedUploadedPicture] = useState<string | null>(null);
	const [updatedUserData, setUpdatedUserData] = useState<UserDataModel | null>(null);
	const [friendsList, setFriendsList] = useState<UserDataModel[]>([]);

	useEffect(() => {
		const fetchUserData = async () => {
			if (id) {
				try {
					const userResponse = await getUser(id);
					const photosResponse = await getUserPhotos(id);
					const friendsResponse = await getAllFriends({ userId: id });
					if (userResponse.success && userResponse.data) {
						setUser(userResponse.data);
						setUpdatedUserData({
							firstName: userResponse.data.firstName || "",
							lastName: userResponse.data.lastName || "",
							email: userResponse.data.email || "",
							profilePictureUrl: userResponse.data.profilePictureUrl || "",
							phoneNumber: userResponse.data.phoneNumber || "",
							aboutMe: userResponse.data.aboutMe || "",
						});
					} else {
						throw new Error(userResponse.message || "Failed to load user data.");
					}

					if (friendsResponse.success && friendsResponse.data) {
						setFriendsList(friendsResponse.data);
					} else {
						throw new Error(friendsResponse.message || "Failed to load friends.");
					}
					if (photosResponse.success && photosResponse.data) {
						setUploadedPictures(photosResponse.data);
					} else {
						throw new Error(photosResponse.message || "Failed to load user photos.");
					}
				} catch (err) {
					toast.error(err instanceof Error ? err.message : "Unknown error occurred");
				}
			}
		};
		fetchUserData();
	}, [id]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUpdatedUserData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleProfileUpdate = async () => {
		if (updatedUserData) {
			updatedUserData.gender = user?.gender;
			const response = await updateProfile(user?.uid as string, updatedUserData as UserDataModel);
			if (response.success) {
				setUser({ ...user, ...updatedUserData });
				setEditModalOpen(false);
				toast.success("Profile updated successfully.");
			} else {
				toast.error(response.message || "Failed to update profile.");
			}
		} else {
			toast.error("No updated user data available.");
		}
	};

	const handleProfilePictureChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setNewProfilePicture(event.target.files[0]);
			setSelectedUploadedPicture(null);
		}
	};

	const reloadUserData = async () => {
		if (id) {
			try {
				const photosResponse = await getUserPhotos(id);
				if (photosResponse.success && photosResponse.data) {
					setUploadedPictures(photosResponse.data);
				}
			} catch (error) {
				toast.error("Failed to reload user data.");
			}
		}
	};

	const handleSaveNewProfilePicture = async () => {
		if (newProfilePicture) {
			const fileName = `${currentUser?.uid}_${new Date().getTime()}`;
			const fileDir = `users/${currentUser?.uid}_photos`;
			const fileUploadResponse = await uploadFile(newProfilePicture, fileDir, fileName);

			if (fileUploadResponse.success) {
				const url = fileUploadResponse.data?.url;
				const updateResponse = await updateProfilePicture(currentUser?.uid as string, url as string);

				if (updateResponse.success) {
					setUpdatedUserData((prevState) => ({
						...prevState,
						profilePictureUrl: url as string,
					}));
					setOpenPhotoSelectionModal(false);
					toast.success("Profile picture updated successfully.");
					reloadUserData();
				} else {
					toast.error(updateResponse.message || "Failed to update profile picture.");
				}
			} else {
				toast.error(fileUploadResponse.message || "Failed to upload profile picture.");
			}
		}
	};

	const handleNewPhotoUpload = async () => {
		if (newPhotoFile) {
			const fileName = `${currentUser?.uid}_${new Date().getTime()}`;
			const fileDir = `users/${currentUser?.uid}_photos`;
			const fileUploadResponse = await uploadFile(newPhotoFile, fileDir, fileName);

			if (fileUploadResponse.success) {
				toast.success("Photo uploaded successfully.");
				setOpenNewPhotoModal(false);
				setNewPhotoFile(null);
				reloadUserData();
			} else {
				toast.error(fileUploadResponse.message || "Failed to upload photo.");
			}
		}
	};

	const handleSelectUploadedPicture = (url: string) => {
		setSelectedUploadedPicture(url);
		setNewProfilePicture(null);
	};

	const handleConfirmSelectUploadedPicture = async () => {
		if (selectedUploadedPicture) {
			const updateResponse = await updateProfilePicture(currentUser?.uid as string, selectedUploadedPicture);
			if (updateResponse.success) {
				setUpdatedUserData((prevState) => ({
					...prevState,
					profilePictureUrl: selectedUploadedPicture,
				}));
				setOpenPhotoSelectionModal(false);
				toast.success("Profile picture updated successfully.");
				reloadUserData();
			} else {
				toast.error(updateResponse.message || "Failed to update profile picture.");
			}
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

	const handleAddFriend = async () => {
		if (currentUser?.uid && user?.uid) {
			try {
				// Send friend request notification
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
					<Box
						sx={{
							position: "relative",
							mb: 3,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
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
								width: "60%",
								textAlign: "center",
								fontSize: "1.2rem",
							}}
						>
							{user?.username}, {calculateAge(user?.dateOfBirth)}
						</Typography>
					</Box>
					{/* Add Friend Button */}
					{!isCurrentUserProfile && (
						<Box mt={2}>
							<Button
								variant='contained'
								color='primary'
								startIcon={<PersonAddIcon />}
								onClick={handleAddFriend}
								sx={{
									background:
										"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
									color: "white",
									"&:hover": {
										background:
											"linear-gradient(45deg, rgba(255,64,129,0.8) 0%, rgba(255,105,135,0.8) 100%)",
									},
								}}
							>
								Add Friend
							</Button>
						</Box>
					)}
					<Paper elevation={3} sx={{ p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
						<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
							<Typography variant='h6' fontWeight='bold'>
								User Info
							</Typography>
							{isCurrentUserProfile && (
								<IconButton onClick={() => setEditModalOpen(true)} size='large'>
									<EditIcon />
								</IconButton>
							)}
						</Box>
						<Box>
							<Typography variant='body1' color='textSecondary'>
								<strong>Name:</strong> {user?.firstName} {user?.lastName}
							</Typography>
							<Typography variant='body1' color='textSecondary'>
								<strong>Email:</strong> {user?.email}
							</Typography>
							<Typography variant='body1' color='textSecondary'>
								<strong>Phone:</strong> {user?.phoneNumber || "N/A"}
							</Typography>
							<Typography variant='body1' color='textSecondary'>
								<strong>Gender:</strong> {user?.gender}
							</Typography>
							<Typography variant='body1' color='textSecondary'>
								<strong>Date of Birth:</strong> {user?.dateOfBirth?.toLocaleDateString() || "N/A"}
							</Typography>
						</Box>
					</Paper>
					{/* About Me Section */}
					<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
						<Box display='flex' justifyContent='space-between' alignItems='center'>
							<Typography variant='h6' fontWeight='bold'>
								About Me
							</Typography>
							{isCurrentUserProfile && (
								<IconButton onClick={() => setEditModalOpen(true)} size='large'>
									<EditIcon />
								</IconButton>
							)}
						</Box>
						<Typography variant='body1' mt={2}>
							{user?.aboutMe || "No information provided."}
						</Typography>
					</Paper>
					{/* Photos Section */}
					<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
						<PhotosSection
							isCurrentUserProfile={isCurrentUserProfile}
							uploadedPictures={uploadedPictures}
							reloadUserData={reloadUserData}
						/>
					</Paper>
					<Box sx={{ mb: 6, width: "100%" }}>
						<Box>
							<FriendsList friendsList={friendsList} hideTitle />
						</Box>
					</Box>
				</Box>

				{/* Modal for editing profile */}
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
								value={user?.dateOfBirth ? dayjs(user.dateOfBirth) : null} // Convert Date to Dayjs
								onChange={(date) => {
									if (updatedUserData && date) {
										updatedUserData.dateOfBirth = date.toDate(); // Convert Dayjs back to Date
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
								variant='contained'
								color='primary'
							>
								Save
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
								Upload New Picture
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
								color='primary'
								startIcon={<SaveIcon />}
								onClick={handleNewPhotoUpload}
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
								Upload Photo
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
