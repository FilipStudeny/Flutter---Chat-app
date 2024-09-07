import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState, useCallback } from "react";

import NotificationType from "../../constants/Enums/NotificationType";
import { FirebaseFireStore } from "../../firebase";

interface UseCheckFriendRequestProps {
	senderId: string;
	senderName: string;
	recipientId: string;
}

interface UseCheckFriendRequest {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	notificationExists: boolean;
	notificationId: string | null;
	checkNotification: () => Promise<boolean>;
}

const useCheckFriendRequest = ({
	senderId,
	senderName,
	recipientId,
}: UseCheckFriendRequestProps): UseCheckFriendRequest => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [notificationExists, setNotificationExists] = useState<boolean>(false);
	const [notificationId, setNotificationId] = useState<string | null>(null);

	const checkNotification = useCallback(async (): Promise<boolean> => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const notificationsCollectionRef = collection(FirebaseFireStore, "users", recipientId, "notifications");

			const q = query(
				notificationsCollectionRef,
				where("senderId", "==", senderId),
				where("type", "==", NotificationType.FRIEND_REQUEST),
				where("message", "==", `${senderName} has sent you a friend request.`),
			);

			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				const notificationDoc = querySnapshot.docs[0];
				setNotificationId(notificationDoc.id);
				setNotificationExists(true);
			} else {
				setNotificationExists(false);
				setNotificationId(null);
			}

			setSuccess(true);
			return !querySnapshot.empty;
		} catch (err) {
			setError("An error occurred while checking the notification.");
			setSuccess(false);
			setNotificationExists(false);
			setNotificationId(null);
			return false;
		} finally {
			setLoading(false);
		}
	}, [senderId, recipientId, senderName]);

	useEffect(() => {
		if (senderId && recipientId) {
			checkNotification();
		}
	}, [checkNotification]);

	return {
		loading,
		error,
		success,
		notificationExists,
		notificationId,
		checkNotification,
	};
};

export default useCheckFriendRequest;
