import { useState } from "react";
import { toast } from "react-hot-toast";

import NotificationType from "../../constants/Enums/NotificationType";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { useAuth } from "../../context/AuthenticationContext";
import removeFriend from "../../services/DatabaseService/removeFriend";
import createNotification from "../../services/NotificationsService/createNotification";

type UseAddFriendHook = (user: UserDataModel) => {
	isFriend: boolean;
	toggleFriend: () => Promise<void>;
	loading: boolean;
};

const useAddFriend: UseAddFriendHook = (user) => {
	const { currentUser, userData } = useAuth();
	const [loading, setLoading] = useState(false);
	const [isFriend, setIsFriend] = useState<boolean>(userData?.friends?.includes(user.uid as string) || false);

	const toggleFriend = async () => {
		if (loading) return; // Prevent multiple clicks
		if (!currentUser?.uid || !user?.uid) return;

		setLoading(true);
		try {
			if (isFriend) {
				// Remove friend logic
				const response = await removeFriend(currentUser.uid, user.uid);
				if (response.success) {
					toast.success("Friend removed successfully.");
					setIsFriend(false);
				} else {
					toast.error(response.message || "Failed to remove friend.");
				}
			} else {
				// Send friend request logic
				const notificationResponse = await createNotification(
					currentUser.uid,
					user.uid,
					`${currentUser.displayName} has sent you a friend request.`,
					NotificationType.FRIEND_REQUEST,
				);

				if (notificationResponse.success) {
					toast.success("Friend request sent successfully.");
					setIsFriend(true);
				} else {
					toast.error(notificationResponse.message || "Failed to send friend request notification.");
				}
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Unknown error occurred");
		} finally {
			setLoading(false);
		}
	};

	return { isFriend, toggleFriend, loading };
};

export default useAddFriend;
