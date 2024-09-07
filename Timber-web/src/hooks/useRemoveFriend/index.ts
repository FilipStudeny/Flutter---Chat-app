import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import removeFriend from "../../services/DatabaseService/removeFriend";

interface UseRemoveFriend {
	loading: boolean;
	error: string | null;
	success: boolean;
	removeFriendAction: (userId: string, friendId: string) => Promise<void>;
}

const useRemoveFriend = (): UseRemoveFriend => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const removeFriendAction = async (userId: string, friendId: string): Promise<void> => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response: ServiceResponse<void> = await removeFriend(userId, friendId);
			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error removing friend.");
			}
		} catch (err) {
			setError("An error occurred while removing the friend.");
		} finally {
			setLoading(false);
		}
	};

	return { loading, error, success, removeFriendAction };
};

export default useRemoveFriend;
