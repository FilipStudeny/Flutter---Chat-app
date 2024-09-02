// SearchFilters.tsx
import EditIcon from "@mui/icons-material/Edit";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
	Box,
	Typography,
	IconButton,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import React from "react";

import { Gender } from "../../../../constants/Enums/Gender";
import { GradientSlider, StyledButton, StyledIconButton, StyledTextField } from "../styles";

interface SearchFiltersProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	ageRange: number[];
	setAgeRange: (value: number[]) => void;
	genderFilter: Gender | "";
	setGenderFilter: (gender: Gender | "") => void;
	loading: boolean;
	fetchUsers: (initialLoad: boolean) => void;
	ageDialogOpen: boolean;
	handleOpenAgeDialog: () => void;
	handleCloseAgeDialog: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
	searchQuery,
	setSearchQuery,
	ageRange,
	setAgeRange,
	genderFilter,
	setGenderFilter,
	loading,
	fetchUsers,
	ageDialogOpen,
	handleOpenAgeDialog,
	handleCloseAgeDialog,
}) => {
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleAgeRangeChange = (_: Event, newValue: number | number[]) => {
		setAgeRange(newValue as number[]);
	};

	const handleGenderFilterChange = (gender: Gender) => {
		setGenderFilter(genderFilter === gender ? "" : gender);
	};

	return (
		<>
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
					sx={{ flex: 2, minWidth: "200px" }}
				/>

				{/* Age Range Display with Edit Icon */}
				<Box
					sx={{ display: "flex", alignItems: "center", flex: 1, cursor: "pointer" }}
					onClick={handleOpenAgeDialog}
				>
					<Typography variant='body1' sx={{ mr: 1, color: "#333", fontWeight: "bold", display: "inline" }}>
						Age:{" "}
					</Typography>
					<Typography variant='body1' sx={{ color: "#FF4081", fontWeight: "bold", display: "inline" }}>
						{ageRange[0]} - {ageRange[1]}
					</Typography>
					<IconButton size='small' sx={{ ml: 1 }}>
						<EditIcon fontSize='small' sx={{ color: "#FF4081" }} />
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
						sx={{ color: "#FF4081", fontWeight: "bold", display: "inline", fontSize: "20px" }}
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
						sx={{ marginTop: "50px" }}
					/>
				</DialogContent>
				<DialogActions>
					<StyledButton onClick={handleCloseAgeDialog}>Done</StyledButton>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default SearchFilters;
