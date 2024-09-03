import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import React from "react";

import SearchFilters from "./Filters";
import { StyledButton } from "./styles";
import { UserDataModel } from "../../../constants/Models/UserDataModel";
import { useUsersListFetch } from "../../../hooks";
import UserCard from "../../Cards/UserCard";

interface UserListProps {
	separateFilter?: boolean;
	fetchFriends?: boolean;
	userId?: string;
}

const UserList: React.FC<UserListProps> = ({ separateFilter, fetchFriends, userId }: UserListProps) => {
	const {
		searchQuery,
		setSearchQuery,
		ageRange,
		setAgeRange,
		genderFilter,
		setGenderFilter,
		ageDialogOpen,
		handleOpenAgeDialog,
		handleCloseAgeDialog,
		loading,
		error,
		searchResults,
		hasMore,
		noResultsFound,
		handleLoadMore,
		fetchUsers,
	} = useUsersListFetch(userId, fetchFriends);

	return (
		<>
			{/* Conditional Rendering of Filters */}
			{separateFilter && (
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
					<SearchFilters
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						ageRange={ageRange}
						setAgeRange={setAgeRange}
						genderFilter={genderFilter}
						setGenderFilter={setGenderFilter}
						loading={loading}
						fetchUsers={fetchUsers}
						ageDialogOpen={ageDialogOpen}
						handleOpenAgeDialog={handleOpenAgeDialog}
						handleCloseAgeDialog={handleCloseAgeDialog}
					/>
				</Box>
			)}

			{/* User List */}
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
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 3,
					}}
				>
					<Typography variant='h6' align='left' sx={{ fontWeight: "medium", color: "text.secondary" }}>
						Found users
					</Typography>

					{/* Render Filters Inline if separateFilter is false */}
					{!separateFilter && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<SearchFilters
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								ageRange={ageRange}
								setAgeRange={setAgeRange}
								genderFilter={genderFilter}
								setGenderFilter={setGenderFilter}
								loading={loading}
								fetchUsers={fetchUsers}
								ageDialogOpen={ageDialogOpen}
								handleOpenAgeDialog={handleOpenAgeDialog}
								handleCloseAgeDialog={handleCloseAgeDialog}
							/>
						</Box>
					)}
				</Box>

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

export default UserList;
