import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, Typography, Card, CardMedia, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";

interface PhotoGalleryProps {
	photos: { id: string; url: string }[]; // Assuming each photo has a unique id and url
	automated?: boolean;
	intervalTime?: number; // Interval time in milliseconds
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, automated = false, intervalTime = 3000 }) => {
	const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

	const handleNextPhoto = () => {
		setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
	};

	const handlePreviousPhoto = () => {
		setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
	};

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (automated) {
			interval = setInterval(handleNextPhoto, intervalTime);
		}
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [automated, intervalTime, photos.length]);

	return (
		<Box sx={{ position: "relative", maxWidth: "600px", margin: "auto" }}>
			<Card sx={{ mb: 2, boxShadow: 4 }}>
				<CardMedia
					component='img'
					height='400'
					image={photos[currentPhotoIndex].url}
					alt={`Photo ${currentPhotoIndex + 1}`}
					sx={{ objectFit: "cover" }}
				/>
			</Card>
			<Box display='flex' justifyContent='space-between' alignItems='center'>
				<IconButton onClick={handlePreviousPhoto} size='large'>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant='body1' color='textSecondary'>
					{currentPhotoIndex + 1} / {photos.length}
				</Typography>
				<IconButton onClick={handleNextPhoto} size='large'>
					<ArrowForwardIcon />
				</IconButton>
			</Box>
			<Grid container spacing={2} mt={2}>
				{photos.map((photo) => (
					<Grid item xs={4} key={photo.id}>
						<Card
							onClick={() => setCurrentPhotoIndex(photos.findIndex((p) => p.id === photo.id))}
							sx={{
								border:
									currentPhotoIndex === photos.findIndex((p) => p.id === photo.id)
										? "2px solid #ff4081"
										: "none",
								cursor: "pointer",
								boxShadow: 3,
							}}
						>
							<CardMedia
								component='img'
								height='100'
								image={photo.url}
								alt={`Thumbnail ${photo.id}`}
								sx={{ objectFit: "cover" }}
							/>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default PhotoGallery;
