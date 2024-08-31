import EditIcon from "@mui/icons-material/Edit"; // Import Edit Icon
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
	Box,
	Typography,
	IconButton,
	Grid,
	Button,
	CircularProgress,
	TextField,
	Slider,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import UserCard from "../../components/Cards/UserCard";
import { Gender } from "../../constants/Enums/Gender";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useGetAllUsersSearch } from "../../hooks";

// Styled components with improved styles
const StyledTextField = styled(TextField)({
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#ccc",
		},
		"&:hover fieldset": {
			borderColor: "#FF4081",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#FF4081",
		},
	},
	"& .MuiInputLabel-root.Mui-focused": {
		color: "#FF4081",
	},
	marginBottom: "16px", // Additional spacing
});

const GradientSlider = styled(Slider)({
	color: "#FF4081",
	"& .MuiSlider-track": {
		background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
		border: "none",
	},
	"& .MuiSlider-rail": {
		opacity: 0.5,
		backgroundColor: "#bfbfbf",
	},
	"& .MuiSlider-thumb": {
		backgroundColor: "#ffffff",
		border: "2px solid currentColor",
		"&:focus, &:hover, &$active": {
			boxShadow: "inherit",
		},
	},
	marginTop: "16px", // Improved spacing
});

const StyledButton = styled(Button)({
	borderRadius: "30px",
	background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
	color: "white",
	textTransform: "none",
	padding: "10px 30px",
	fontWeight: "bold",
	transition: "background-color 0.3s ease",
	"&:hover": {
		background: "linear-gradient(45deg, rgba(255,105,135,1) 0%, rgba(255,64,129,1) 100%)",
	},
});

const StyledIconButton = styled(IconButton)({
	borderRadius: "50%",
	margin: "0 8px",
	transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
	border: "2px solid transparent",
	"&:hover": {
		backgroundColor: "rgba(255, 64, 129, 0.1)",
	},
	"&.selected": {
		backgroundColor: "#FF4081",
		borderColor: "#FF4081",
		color: "#ffffff",
	},
});

const SearchPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [ageRange, setAgeRange] = useState<number[]>([18, 99]);
	const [genderFilter, setGenderFilter] = useState<Gender | "">("");
	const [ageDialogOpen, setAgeDialogOpen] = useState<boolean>(false);

	const { loading, error, searchResults, hasMore, noResultsFound, fetchUsers } = useGetAllUsersSearch({
		ageRange,
		genderFilter,
		searchQuery,
	});

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleAgeRangeChange = (_: Event, newValue: number | number[]) => {
		setAgeRange(newValue as number[]);
	};

	const handleGenderFilterChange = (gender: Gender) => {
		setGenderFilter(genderFilter === gender ? "" : gender);
	};

	const handleOpenAgeDialog = () => {
		setAgeDialogOpen(true);
	};

	const handleCloseAgeDialog = () => {
		setAgeDialogOpen(false);
	};

	// Define the missing handleLoadMore function
	const handleLoadMore = () => {
		fetchUsers(false);
	};

	useEffect(() => {
		fetchUsers(true);
	}, []);

	return (
		<>
			<Toaster position='top-right' reverseOrder={false} />

			{/* Search Section */}
			<Box
				sx={{
					mb: 4,
					width: "100%",
					maxWidth: "900px",
					padding: 3,
					borderRadius: 2,
					boxShadow: 3,
					backgroundColor: "white",
					margin: "0 auto", // Center the search section
				}}
			>
				{/* Filters Section */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						gap: 2,
						flexWrap: "wrap",
					}}
				>
					{/* Search Input */}
					<StyledTextField
						label='Search by name or surname'
						variant='outlined'
						value={searchQuery}
						onChange={handleSearchChange}
						sx={{ flex: 2, minWidth: "200px" }} // Adjusted width to align with other filters
					/>

					{/* Age Range Display with Edit Icon */}
					<Box
						sx={{ display: "flex", alignItems: "center", flex: 1, cursor: "pointer" }}
						onClick={handleOpenAgeDialog}
					>
						<Typography
							variant='body1'
							sx={{
								mr: 1,
								color: "#333",
								fontWeight: "bold",
								display: "inline",
							}}
						>
							Age Range:{" "}
						</Typography>
						<Typography
							variant='body1'
							sx={{
								color: "#FF4081",
								fontWeight: "bold",
								display: "inline",
							}}
						>
							{ageRange[0]} - {ageRange[1]}
						</Typography>
						<IconButton size='small' sx={{ ml: 1 }}>
							<EditIcon
								fontSize='small'
								sx={{
									color: "#FF4081", // Highlight color for selected age range
								}}
							/>
						</IconButton>
					</Box>

					{/* Gender Selection with IconButtons */}
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<StyledIconButton
							onClick={() => handleGenderFilterChange(Gender.Male)}
							className={genderFilter === Gender.Male ? "selected" : ""}
						>
							<MaleIcon />
						</StyledIconButton>
						<StyledIconButton
							onClick={() => handleGenderFilterChange(Gender.Female)}
							className={genderFilter === Gender.Female ? "selected" : ""}
						>
							<FemaleIcon />
						</StyledIconButton>
					</Box>

					{/* Search Button */}
					<StyledButton onClick={() => fetchUsers(true)} disabled={loading}>
						{loading ? <CircularProgress size={24} color='inherit' /> : "Search"}
					</StyledButton>
				</Box>
			</Box>

			{/* Dialog for Age Range Selection */}
			<Dialog
				open={ageDialogOpen}
				onClose={handleCloseAgeDialog}
				aria-labelledby='age-range-dialog'
				maxWidth='sm'
				fullWidth
			>
				<DialogTitle id='age-range-dialog'>
					Select Age Range:{" "}
					<Typography
						variant='body1'
						sx={{
							color: "#FF4081",
							fontWeight: "bold",
							display: "inline",
							fontSize: "20px",
						}}
					>
						{ageRange[0]} - {ageRange[1]}
					</Typography>
				</DialogTitle>
				<DialogContent>
					<GradientSlider
						value={ageRange}
						onChange={handleAgeRangeChange}
						valueLabelDisplay='auto'
						min={18}
						max={99}
						step={1}
						marks={[
							{ value: 18, label: "18" },
							{ value: 99, label: "99" },
						]}
						sx={{
							marginTop: "50px",
						}}
					/>
				</DialogContent>
				<DialogActions>
					<StyledButton onClick={handleCloseAgeDialog}>Done</StyledButton>
				</DialogActions>
			</Dialog>

			{/* Search Results Section */}
			<Box
				sx={{
					width: "100%",
					maxWidth: "900px",
					textAlign: "center",
					backgroundColor: "white",
					borderRadius: 2,
					boxShadow: 1,
					p: 3,
					margin: "0 auto",
					marginTop: "24px",
				}}
			>
				<Typography variant='h6' align='left' sx={{ mb: 3, fontWeight: "medium", color: "text.secondary" }}>
					Found users
				</Typography>

				{loading && searchResults.length === 0 ? (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						<CircularProgress />
					</Box>
				) : noResultsFound ? (
					<Typography variant='body2' align='center' color='error'>
						No users found. Please adjust your search criteria.
					</Typography>
				) : (
					<>
						<Grid container spacing={2}>
							{searchResults.map((user: UserDataModel) => (
								<Grid item xs={12} sm={6} md={4} key={user.uid}>
									<UserCard user={user} />
								</Grid>
							))}
						</Grid>

						{/* Load More Button */}
						{hasMore && (
							<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
								<StyledButton onClick={handleLoadMore} disabled={loading}>
									{loading ? <CircularProgress size={24} color='inherit' /> : "Load More"}
								</StyledButton>
							</Box>
						)}

						{/* No More Users Message */}
						{!hasMore && searchResults.length > 0 && (
							<Typography variant='body2' align='center' color='textSecondary' sx={{ mt: 2 }}>
								No more users found.
							</Typography>
						)}
					</>
				)}

				{/* Error Message */}
				{error && (
					<Typography variant='body2' align='center' color='error'>
						{error}
					</Typography>
				)}
			</Box>
		</>
	);
};

export default SearchPage;
