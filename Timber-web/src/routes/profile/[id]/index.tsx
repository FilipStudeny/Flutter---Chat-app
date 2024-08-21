import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
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
	Modal,
	Card,
	CardActionArea,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import React, { useEffect, useState, ChangeEvent } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

import FriendsList from "../../../components/Lists/FriendList";
import { calculateAge, UserDataModel } from "../../../constants/Models/UserDataModel";
import { useAuth } from "../../../context/AuthenticationContext";
import getAllFriends from "../../../services/DatabaseService/getAllFriends";
import getUser from "../../../services/DatabaseService/getUser";
import updateProfile from "../../../services/DatabaseService/updateProfile";
import updateProfilePicture from "../../../services/DatabaseService/updateProfilePicture";
import getUserPhotos from "../../../services/FileStorageService/getUserPhotos";
import { FileMetadata, uploadFile } from "../../../services/FileStorageService/uploadFile";

const UserProfilePage: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const { currentUser } = useAuth();

	const [user, setUser] = useState<UserDataModel | null>(null);
	const [uploadedPictures, setUploadedPictures] = useState<FileMetadata[]>([]);
	const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
	const [openPhotoSelectionModal, setOpenPhotoSelectionModal] = useState(false);
	const [openNewPhotoModal, setOpenNewPhotoModal] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedUploadedPicture, setSelectedUploadedPicture] = useState<string | null>(null);
	const [updatedUserData, setUpdatedUserData] = useState<UserDataModel | null>(null);
	const [friendsList, setFriendsList] = useState<UserDataModel[] | null>(null);

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

	const handleDownloadPhoto = () => {
		if (currentPhotoIndex !== null && uploadedPictures[currentPhotoIndex]) {
			const photoUrl = uploadedPictures[currentPhotoIndex].url;
			const link = document.createElement("a");
			link.href = photoUrl;
			link.download = "photo.jpg";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
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
			const userResponse = await getUser(id);
			if (userResponse.success && userResponse.data) {
				setUser(userResponse.data);
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

	const handleOpenModal = (index: number) => {
		setCurrentPhotoIndex(index);
	};

	const handleCloseModal = () => {
		setCurrentPhotoIndex(null);
	};

	const handleOpenPhotoSelectionModal = () => {
		setOpenPhotoSelectionModal(true);
	};

	const handleClosePhotoSelectionModal = () => {
		setOpenPhotoSelectionModal(false);
		setNewProfilePicture(null);
		setSelectedUploadedPicture(null);
	};

	const handleOpenNewPhotoModal = () => {
		setOpenNewPhotoModal(true);
	};

	const handleCloseNewPhotoModal = () => {
		setOpenNewPhotoModal(false);
		setNewPhotoFile(null);
	};

	const handleNextPhoto = () => {
		if (currentPhotoIndex !== null) {
			setCurrentPhotoIndex((prevIndex) => {
				if (prevIndex === null) return 0;
				return (prevIndex + 1) % uploadedPictures.length;
			});
		}
	};

	const handlePreviousPhoto = () => {
		if (currentPhotoIndex !== null) {
			setCurrentPhotoIndex((prevIndex) => {
				if (prevIndex === null) return uploadedPictures.length - 1;
				return (prevIndex - 1 + uploadedPictures.length) % uploadedPictures.length;
			});
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

					<Paper elevation={3} sx={{ mt: 3, p: 3, width: "100%", borderRadius: 4, boxShadow: 3 }}>
						<Typography variant='h6' fontWeight='bold'>
							Photos
						</Typography>
						<Grid container spacing={2} mt={1}>
							{uploadedPictures.map((picture, index) => (
								<Grid item key={picture.name || picture.url}>
									<Card sx={{ width: 120, height: 120, borderRadius: 2, boxShadow: 2 }}>
										<CardActionArea
											onClick={() => handleOpenModal(index)}
											sx={{
												height: "100%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Box sx={{ height: "100%", overflow: "hidden", borderRadius: 2 }}>
												<img
													src={picture.url}
													alt={user?.username}
													style={{
														width: "100%",
														height: "100%",
														objectFit: "cover",
													}}
												/>
											</Box>
										</CardActionArea>
									</Card>
								</Grid>
							))}
							{isCurrentUserProfile && (
								<Grid item>
									<Card
										sx={{ width: 120, height: 120, borderRadius: 2, boxShadow: 2 }}
										onClick={handleOpenNewPhotoModal}
									>
										<CardActionArea
											sx={{
												height: "100%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
											}}
										>
											<Box
												sx={{
													display: "flex",
													flexDirection: "column",
													justifyContent: "center",
													alignItems: "center",
													height: "100%",
													color: "gray",
												}}
											>
												<AddPhotoAlternateIcon sx={{ fontSize: 50 }} />
												<Typography>Add Photo</Typography>
											</Box>
										</CardActionArea>
									</Card>
								</Grid>
							)}
						</Grid>
					</Paper>

					<FriendsList friendsList={friendsList as UserDataModel[]} />
				</Box>

				{/* Modal for viewing photo */}
				<Modal
					open={currentPhotoIndex !== null}
					onClose={handleCloseModal}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Box
						sx={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100vw",
							height: "100vh",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							bgcolor: "rgba(0, 0, 0, 0.9)",
						}}
						onClick={handleCloseModal}
					>
						<IconButton
							onClick={handleCloseModal}
							sx={{
								position: "fixed",
								top: "16px",
								right: "16px",
								color: "white",
								fontSize: "32px",
							}}
						>
							<CloseIcon fontSize='inherit' />
						</IconButton>
						<IconButton
							onClick={handleDownloadPhoto}
							sx={{
								position: "fixed",
								top: "16px",
								left: "16px",
								color: "white",
								fontSize: "32px",
							}}
						>
							<DownloadIcon fontSize='inherit' />
						</IconButton>
						{currentPhotoIndex !== null && uploadedPictures.length > 1 && (
							<>
								<IconButton
									onClick={(e) => {
										e.stopPropagation();
										handlePreviousPhoto();
									}}
									sx={{
										position: "absolute",
										left: "16px",
										color: "white",
										fontSize: "32px",
									}}
								>
									<ArrowBackIcon fontSize='inherit' />
								</IconButton>
								<IconButton
									onClick={(e) => {
										e.stopPropagation();
										handleNextPhoto();
									}}
									sx={{
										position: "absolute",
										right: "16px",
										color: "white",
										fontSize: "32px",
									}}
								>
									<ArrowForwardIcon fontSize='inherit' />
								</IconButton>
							</>
						)}
						{currentPhotoIndex !== null && (
							<img
								src={uploadedPictures[currentPhotoIndex].url}
								alt='User'
								style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "8px", cursor: "auto" }}
								onClick={(e) => e.stopPropagation()}
							/>
						)}
					</Box>
				</Modal>

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
							<Button onClick={() => setEditModalOpen(false)} color='secondary'>
								Cancel
							</Button>
							<Button onClick={handleProfileUpdate} variant='contained' color='primary'>
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
			</Container>
		</>
	);
};

export default UserProfilePage;
