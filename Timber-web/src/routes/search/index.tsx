import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import {
	Box,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Button,
	CircularProgress,
	SelectChangeEvent,
	Divider,
	TextField,
	Slider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import UserCard from "../../components/Cards/UserCard";
import { Gender } from "../../constants/Enums/Gender";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import getAllUsers from "../../services/DatabaseService/getAllUsers";

// Define the styled TextField component
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
});

// Define the styled Slider component
const GradientSlider = styled(Slider)({
	color: "#FF4081", // Default color for the thumb
	"& .MuiSlider-track": {
		background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)", // Gradient for the track
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
});

const SearchPage: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [ageRange, setAgeRange] = useState<number[]>([18, 99]);
	const [genderFilter, setGenderFilter] = useState<Gender | "">("");
	const [searchResults, setSearchResults] = useState<UserDataModel[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastDocument, setLastDocument] = useState<DocumentSnapshot<DocumentData> | undefined>(undefined);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

	const { currentUser } = useAuth();

	const handleSearch = async (reset: boolean = false) => {
		if (loading) return;

		setLoading(true);
		setError(null);

		if (reset) {
			setLastDocument(undefined);
			setHasMore(true);
			setNoResultsFound(false);
			setSearchResults([]);
		}

		const [minAge, maxAge] = ageRange;

		try {
			const response = await getAllUsers({
				limit: 3,
				lastDocument: reset ? undefined : lastDocument,
				excludeId: currentUser?.uid,
				gender: genderFilter ? (genderFilter as Gender) : undefined,
				minAge,
				maxAge,
				username: searchQuery.trim(),
			});

			if (response.success) {
				const newUsers = response.data || [];

				if (newUsers.length === 0 && reset) {
					setNoResultsFound(true);
				} else {
					setNoResultsFound(false);
				}

				setSearchResults((prevResults) => (reset ? newUsers : [...prevResults, ...newUsers]));

				// Update lastDocument for pagination if more users exist
				if (newUsers.length > 0 && response.data !== undefined) {
					const lastVisible = response.data[response.data.length - 1];
					setLastDocument(lastVisible as DocumentSnapshot<DocumentData>);

					setHasMore(newUsers.length === 3);
				} else {
					setHasMore(false);
				}
			} else {
				setError(response.message || "Error fetching users.");
				setHasMore(false);
			}
		} catch (err) {
			setError("An error occurred while fetching users.");
		} finally {
			setLoading(false);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	};

	const handleAgeRangeChange = (_: Event, newValue: number | number[]) => {
		setAgeRange(newValue as number[]);
	};

	const handleGenderFilterChange = (event: SelectChangeEvent<string>) => {
		setGenderFilter(event.target.value as Gender);
	};

	const handleLoadMore = () => {
		if (!loading && hasMore) {
			handleSearch(false);
		}
	};

	useEffect(() => {
		handleSearch(true);
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
					padding: 2,
					borderRadius: 2,
					boxShadow: 3,
					backgroundColor: "white",
				}}
			>
				<Typography variant='h6' align='center' sx={{ mb: 2, fontWeight: "medium", color: "text.secondary" }}>
					Search Users
				</Typography>

				{/* Search Input */}
				<Box sx={{ mb: 2 }}>
					<StyledTextField
						label='Search by name or surname'
						variant='outlined'
						fullWidth
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</Box>

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
					<Box sx={{ flex: 1, textAlign: "center" }}>
						<Typography gutterBottom>
							Age Range: {ageRange[0]} - {ageRange[1]}
						</Typography>
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
						/>
					</Box>
					<FormControl sx={{ width: "150px" }} variant='outlined'>
						<InputLabel id='gender-filter' shrink>
							Gender
						</InputLabel>
						<Select
							value={genderFilter}
							onChange={handleGenderFilterChange}
							displayEmpty
							notched
							id='gender-filter'
							label='Gender'
						>
							<MenuItem value=''>
								<em>Any</em>
							</MenuItem>
							<MenuItem value={Gender.Male}>
								<MaleIcon sx={{ marginRight: 1 }} /> Male
							</MenuItem>
							<MenuItem value={Gender.Female}>
								<FemaleIcon sx={{ marginRight: 1 }} /> Female
							</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant='contained'
						sx={{
							background: "linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
							color: "white",
							minWidth: "100px",
							"&:hover": {
								background: "linear-gradient(45deg, rgba(255,105,135,1) 0%, rgba(255,64,129,1) 100%)",
							},
						}}
						onClick={() => handleSearch(true)}
						disabled={loading}
					>
						{loading ? "Searching..." : "Search"}
					</Button>
				</Box>
			</Box>

			{/* Divider between sections */}
			<Divider sx={{ width: "100%", maxWidth: "900px", mb: 4 }} />

			{/* Search Results Section */}
			<Box
				sx={{
					width: "100%",
					maxWidth: "900px",
					textAlign: "center",
					backgroundColor: "white",
					borderRadius: 2,
					boxShadow: 1,
					p: 2,
				}}
			>
				<Typography variant='h6' align='center' sx={{ mb: 2, fontWeight: "medium", color: "text.secondary" }}>
					Search Results
				</Typography>

				{loading && searchResults.length === 0 ? (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						<CircularProgress />
					</Box>
				) : noResultsFound ? (
					<Typography variant='body2' align='center' color='error'>
						No users found.
					</Typography>
				) : (
					<>
						<Grid container spacing={2}>
							{searchResults.map((user) => (
								<Grid item xs={12} sm={6} md={4} key={user.uid}>
									<UserCard user={user} />
								</Grid>
							))}
						</Grid>

						{/* Load More Button */}
						{hasMore && (
							<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
								<Button
									variant='contained'
									sx={{
										background:
											"linear-gradient(45deg, rgba(255,64,129,1) 0%, rgba(255,105,135,1) 100%)",
										color: "white",
										"&:hover": {
											background:
												"linear-gradient(45deg, rgba(255,105,135,1) 0%, rgba(255,64,129,1) 100%)",
										},
									}}
									onClick={handleLoadMore}
									disabled={loading}
								>
									{loading ? "Loading..." : "Load More"}
								</Button>
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
