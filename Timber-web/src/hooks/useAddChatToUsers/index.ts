import { useState, useCallback } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import addChatToUsers from "../../services/DatabaseService/addChatToUsers";

/**
 * Custom hook for adding a chat to users' chat lists in Firestore.
 * It provides loading, success, error, and a method to trigger the operation.
 *
 * @returns {object} - Returns the loading state, error, and a function to add chat to users.
 */
const useAddChatToUsers = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const addChat = useCallback(
		async (currentUserId: string, recipientId: string, currentUserName: string, recipientName: string) => {
			setLoading(true);
			setError(null);
			setSuccess(false);

			const response: ServiceResponse<boolean> = await addChatToUsers(
				currentUserId,
				recipientId,
				currentUserName,
				recipientName,
			);

			setLoading(false);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "An error occurred while adding the chat.");
			}
		},
		[],
	);

	return { loading, error, success, addChat };
};

export default useAddChatToUsers;
