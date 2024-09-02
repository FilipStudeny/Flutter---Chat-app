// SearchPage.tsx
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

import UserList from "../../components/Lists/UsersList"; // Adjusted import path
import { Gender } from "../../constants/Enums/Gender";
import { useGetAllUsersSearch } from "../../hooks";

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

	const handleOpenAgeDialog = () => {
		setAgeDialogOpen(true);
	};

	const handleCloseAgeDialog = () => {
		setAgeDialogOpen(false);
	};

	// Function to handle fetching more users
	const handleLoadMore = () => {
		fetchUsers(false);
	};

	useEffect(() => {
		// Fetch users on component mount
		fetchUsers(true);
	}, []);

	return (
		<>
			<Toaster position='top-right' reverseOrder={false} />

			{/* User List and Filters Together */}
			<UserList
				loading={loading}
				error={error}
				searchResults={searchResults}
				hasMore={hasMore}
				noResultsFound={noResultsFound}
				handleLoadMore={handleLoadMore}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				ageRange={ageRange}
				setAgeRange={setAgeRange}
				genderFilter={genderFilter}
				setGenderFilter={setGenderFilter}
				fetchUsers={fetchUsers}
				ageDialogOpen={ageDialogOpen}
				handleOpenAgeDialog={handleOpenAgeDialog}
				handleCloseAgeDialog={handleCloseAgeDialog}
			/>
		</>
	);
};

export default SearchPage;
