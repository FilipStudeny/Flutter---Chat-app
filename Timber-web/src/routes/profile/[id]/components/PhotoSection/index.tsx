import {
	AddPhotoAlternate as AddPhotoAlternateIcon,
	Delete as DeleteIcon,
	Close as CloseIcon,
	ArrowBack as ArrowBackIcon,
	ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardActionArea,
	IconButton,
	Button,
	Modal,
	Dialog,
	Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { useAuth } from "../../../../../context/AuthenticationContext";
import { deleteMultipleFiles } from "../../../../../services/FileStorageService/deleteFile";
import { uploadFile, FileMetadata } from "../../../../../services/FileStorageService/uploadFile";

interface PhotosSectionProps {
	isCurrentUserProfile: boolean;
	uploadedPictures: FileMetadata[];
	reloadUserData: () => Promise<void>;
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ isCurrentUserProfile, uploadedPictures, reloadUserData }) => {
	const { currentUser } = useAuth();
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
	const [openNewPhotoModal, setOpenNewPhotoModal] = useState(false);
	const [openManagePhotosModal, setOpenManagePhotosModal] = useState(false);
	const [selectedPicturesForDeletion, setSelectedPicturesForDeletion] = useState<string[]>([]);

	const handleOpenModal = (index: number) => {
		setCurrentPhotoIndex(index);
	};

	const handleCloseModal = () => {
		setCurrentPhotoIndex(null);
	};

	const handleOpenNewPhotoModal = () => {
		setOpenNewPhotoModal(true);
	};

	const handleCloseNewPhotoModal = () => {
		setOpenNewPhotoModal(false);
		setNewPhotoFile(null);
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
				await reloadUserData();
			} else {
				toast.error(fileUploadResponse.message || "Failed to upload photo.");
			}
		}
	};

	const handleOpenManagePhotosModal = () => {
		setSelectedPicturesForDeletion([]);
		setOpenManagePhotosModal(true);
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
		if (selectedPicturesForDeletion.length > 0) {
			const deleteResults = await deleteMultipleFiles(selectedPicturesForDeletion);
			const successCount = deleteResults.filter((result) => result.success).length;
			const failureCount = deleteResults.length - successCount;

			if (successCount > 0) {
				toast.success(`${successCount} photo(s) deleted successfully.`);
			}

			if (failureCount > 0) {
				toast.error(`${failureCount} photo(s) failed to delete.`);
			}

			setOpenManagePhotosModal(false);
			setSelectedPicturesForDeletion([]);
			await reloadUserData();
		}
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

	return (
		<>
			<Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
				<Typography variant='h6' fontWeight='bold' color='text.primary'>
					Photos
				</Typography>
				{isCurrentUserProfile && (
					<Button
						variant='outlined'
						sx={{
							borderColor: "rgba(255,64,129,1)",
							color: "rgba(255,64,129,1)",
							transition: "all 0.3s ease",
							"&:hover": {
								borderColor: "rgba(255,105,135,1)",
								color: "rgba(255,105,135,1)",
								backgroundColor: "rgba(255,64,129,0.1)",
							},
						}}
						onClick={handleOpenManagePhotosModal}
					>
						Manage Photos
					</Button>
				)}
			</Box>
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
										alt={picture.name}
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
							startIcon={<AddPhotoAlternateIcon />}
							sx={{
								background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
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
							startIcon={<AddPhotoAlternateIcon />}
							onClick={handleNewPhotoUpload}
							sx={{
								background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
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
						<Button
							variant='outlined'
							sx={{
								borderColor: "rgba(255,64,129,1)",
								color: "rgba(255,64,129,1)",
								transition: "all 0.3s ease",
								"&:hover": {
									borderColor: "rgba(255,105,135,1)",
									color: "rgba(255,105,135,1)",
									backgroundColor: "rgba(255,64,129,0.1)",
								},
							}}
							onClick={handleCloseManagePhotosModal}
						>
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
		</>
	);
};

export default PhotosSection;
