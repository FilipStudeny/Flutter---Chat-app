import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import addFriend from "../../services/DatabaseService/addFriend";

interface UseAddFriend {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	addFriendToUser: (userId: string, friendId: string) => Promise<void>;
}

const useAddFriend = (): UseAddFriend => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	const addFriendToUser = async (userId: string, friendId: string): Promise<void> => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response: ServiceResponse<void> = await addFriend(userId, friendId);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error adding friend.");
			}
		} catch (err) {
			setError("An error occurred while adding the friend.");
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		addFriendToUser,
	};
};

export default useAddFriend;
