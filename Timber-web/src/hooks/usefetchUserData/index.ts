import { useState } from "react";

import { UserDataModel } from "../../constants/Models/UserDataModel";
import getUser from "../../services/DatabaseService/getUser"; // Adjust the import path as necessary

interface UseFetchUserDataProps {
	id: string;
}

interface UseFetchUserData {
	loading: boolean;
	error: string | null;
	user: UserDataModel | null;
	fetchUser: (userId: string) => Promise<void>;
	reset: () => void;
}

const useFetchUserData = ({ id }: UseFetchUserDataProps): UseFetchUserData => {
	const [user, setUser] = useState<UserDataModel | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getUser(id);

			if (response.success && response.data) {
				setUser(response.data);
			} else {
				throw new Error(response.message || "Failed to load user data.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred while fetching user data.");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setUser(null);
		setError(null);
		setLoading(false);
	};

	return {
		loading,
		error,
		user,
		fetchUser,
		reset,
	};
};

export default useFetchUserData;
