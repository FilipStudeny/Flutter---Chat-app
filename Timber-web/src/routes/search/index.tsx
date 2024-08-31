import {
	Container,
	Box,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Card,
	CardContent,
	Button,
	CircularProgress,
	SelectChangeEvent,
	Slider,
} from "@mui/material";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";

import { Gender } from "../../constants/Enums/Gender";
import { calculateAge, UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import getAllUsers from "../../services/DatabaseService/getAllUsers";

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
		<Container
			sx={{
				pt: 4,
				pb: 6,
				color: "text.primary",
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				backgroundColor: "#f5f5f5",
			}}
		>
			<Toaster position='top-right' reverseOrder={false} />

			{/* Search Section */}
			<Box sx={{ mb: 4, width: "100%" }}>
				<Typography variant='h6' align='center' sx={{ mb: 2, fontWeight: "medium", color: "text.secondary" }}>
					Search Users
				</Typography>

				{/* Search Input */}
				<Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
					<TextField
						label='Search by name or surname'
						variant='outlined'
						value={searchQuery}
						onChange={handleSearchChange}
						sx={{ width: "300px" }}
					/>
					<Box sx={{ width: 300, px: 2 }}>
						<Typography gutterBottom>Age Range</Typography>
						<Slider
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
					<FormControl sx={{ minWidth: 120 }}>
						<InputLabel>Gender</InputLabel>
						<Select value={genderFilter} onChange={handleGenderFilterChange}>
							<MenuItem value=''>Any</MenuItem>
							<MenuItem value={Gender.Male}>Male</MenuItem>
							<MenuItem value={Gender.Female}>Female</MenuItem>
						</Select>
					</FormControl>
					<Button variant='contained' color='primary' onClick={() => handleSearch(true)} disabled={loading}>
						{loading ? "Searching..." : "Search"}
					</Button>
				</Box>
			</Box>

			{/* Search Results Section */}
			<Box sx={{ width: "100%" }}>
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
								<Grid item xs={12} sm={8} md={6} key={user.uid}>
									<Card sx={{ boxShadow: 2, borderRadius: 2 }}>
										<CardContent>
											<Typography variant='h6'>
												{user.firstName} {user.lastName}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Age: {calculateAge(user.dateOfBirth as Date)}
											</Typography>
											<Typography variant='body2' color='text.secondary'>
												Gender: {user.gender || "N/A"}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>

						{/* Load More Button */}
						{hasMore && (
							<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
								<Button variant='contained' color='primary' onClick={handleLoadMore} disabled={loading}>
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
		</Container>
	);
};

export default SearchPage;
