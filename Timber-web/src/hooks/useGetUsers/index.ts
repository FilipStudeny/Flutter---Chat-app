import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useState } from "react";

import { Gender } from "../../constants/Enums/Gender";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import getAllUsers from "../../services/DatabaseService/getAllUsers";

interface UseGetUsersProps {
	ageRange: number[];
	genderFilter: Gender | "";
	searchQuery: string;
	userId?: string;
	fetchFriends?: boolean;
}

interface UseGetUsers {
	loading: boolean;
	error: string | null;
	searchResults: UserDataModel[];
	hasMore: boolean;
	noResultsFound: boolean;
	fetchUsers: (reset?: boolean) => Promise<void>;
}

const useGetUsers = ({ ageRange, genderFilter, searchQuery, fetchFriends, userId }: UseGetUsersProps): UseGetUsers => {
	const [searchResults, setSearchResults] = useState<UserDataModel[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastDocument, setLastDocument] = useState<DocumentSnapshot<DocumentData> | undefined>(undefined);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

	const { currentUser } = useAuth();

	const fetchUsers = async (reset: boolean = false) => {
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
				userId,
				fetchFriends,
			});

			if (response.success) {
				const newUsers = response.data || [];

				if (newUsers.length === 0 && reset) {
					setNoResultsFound(true);
				} else {
					setNoResultsFound(false);
				}

				setSearchResults((prevResults) => (reset ? newUsers : [...prevResults, ...newUsers]));

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

	return {
		loading,
		error,
		searchResults,
		hasMore,
		noResultsFound,
		fetchUsers,
	};
};

export default useGetUsers;
