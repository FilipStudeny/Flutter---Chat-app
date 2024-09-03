import { useState, useEffect } from "react";

import { Gender } from "../../constants/Enums/Gender";
import useGetUsers from "../useGetUsers";

function useUsersListFetch(userId: string | undefined, fetchFriends: boolean = false) {
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [ageRange, setAgeRange] = useState<number[]>([18, 99]);
	const [genderFilter, setGenderFilter] = useState<Gender | "">("");
	const [ageDialogOpen, setAgeDialogOpen] = useState<boolean>(false);

	const { loading, error, searchResults, hasMore, noResultsFound, fetchUsers } = useGetUsers({
		ageRange,
		genderFilter,
		searchQuery,
		fetchFriends,
		userId,
	});

	const handleOpenAgeDialog = () => {
		setAgeDialogOpen(true);
	};

	const handleCloseAgeDialog = () => {
		setAgeDialogOpen(false);
	};

	const handleLoadMore = () => {
		fetchUsers(false);
	};

	useEffect(() => {
		fetchUsers(true);
	}, [userId]);

	return {
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
	};
}

export default useUsersListFetch;
