import { useState, useEffect } from "react";

import { UserDataModel } from "../../constants/Models/UserDataModel";
import getUser from "../../services/DatabaseService/getUser";

interface UseGetUserProps {
	userId: string;
}

interface UseGetUser {
	loading: boolean;
	error: string | null;
	user: UserDataModel | null;
	fetchUser: () => Promise<void>;
}

const useGetUser = ({ userId }: UseGetUserProps): UseGetUser => {
	const [user, setUser] = useState<UserDataModel | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUser = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getUser(userId);

			if (response.success && response.data) {
				setUser(response.data);
			} else {
				setError(response.message || "Error fetching user.");
			}
		} catch (err) {
			setError("An error occurred while fetching the user.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (userId) {
			fetchUser();
		}
	}, [userId]);

	return {
		loading,
		error,
		user,
		fetchUser,
	};
};

export default useGetUser;
