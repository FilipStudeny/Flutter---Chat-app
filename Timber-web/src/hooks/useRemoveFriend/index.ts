import { useState } from "react";
import { toast } from "react-hot-toast";

import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import removeFriend from "../../services/DatabaseService/removeFriend";

type UseRemoveFriendHook = (
	user: UserDataModel,
	handleCloseRemoveFriendModal: () => void,
) => {
	removeFriendAction: () => Promise<void>;
	loading: boolean;
};

const useRemoveFriend: UseRemoveFriendHook = (user, handleCloseRemoveFriendModal) => {
	const { currentUser, userData, setUserData } = useAuth();
	const [loading, setLoading] = useState(false);

	const removeFriendAction = async () => {
		if (!currentUser?.uid || !user?.uid) return;

		setLoading(true);

		try {
			const response = await removeFriend(currentUser.uid, user.uid);
			if (response.success) {
				toast.success("Friend removed successfully.");

				if (userData) {
					const updatedFriends = userData.friends?.filter((friendId) => friendId !== user.uid) || [];

					setUserData({
						...userData,
						friends: updatedFriends,
					});
				}

				handleCloseRemoveFriendModal();
			} else {
				toast.error(response.message || "Failed to remove friend.");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	return { removeFriendAction, loading };
};

export default useRemoveFriend;
