import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useState } from "react";

import NotificationType from "../../constants/Enums/NotificationType";
import UserNotification from "../../constants/Models/UserNotification";
import { useAuth } from "../../context/AuthenticationContext";
import getNotifications from "../../services/NotificationsService/getNotifications";

interface UseGetNotificationsProps {
	notificationType?: NotificationType | "";
	userId: string;
}

interface UseGetNotifications {
	loading: boolean;
	error: string | null;
	notifications: UserNotification[];
	hasMore: boolean;
	noResultsFound: boolean;
	fetchNotifications: (reset?: boolean) => Promise<void>;
}

const useGetNotifications = ({ notificationType, userId }: UseGetNotificationsProps): UseGetNotifications => {
	const [notifications, setNotifications] = useState<UserNotification[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastDocument, setLastDocument] = useState<DocumentSnapshot<DocumentData> | undefined>(undefined);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

	const { currentUser } = useAuth();

	const fetchNotifications = async (reset: boolean = false) => {
		if (loading) return;

		setLoading(true);
		setError(null);

		if (reset) {
			setLastDocument(undefined);
			setHasMore(true);
			setNoResultsFound(false);
			setNotifications([]);
		}

		try {
			const response = await getNotifications({
				userId: currentUser?.uid || userId,
				notificationType: notificationType || "",
				pageSize: 5,
				lastDocument: reset ? undefined : lastDocument,
			});

			if (response.success) {
				const newNotifications = response.data || [];

				if (newNotifications.length === 0 && reset) {
					setNoResultsFound(true);
				} else {
					setNoResultsFound(false);
				}

				setNotifications((prevResults) => (reset ? newNotifications : [...prevResults, ...newNotifications]));

				if (newNotifications.length > 0 && response.data !== undefined) {
					const lastVisible = response.lastDocumentSnapshot;
					setLastDocument(lastVisible);
					setHasMore(newNotifications.length === 5);
				} else {
					setHasMore(false);
				}
			} else {
				setError(response.message || "Error fetching notifications.");
				setHasMore(false);
			}
		} catch (err) {
			setError("An error occurred while fetching notifications.");
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		notifications,
		hasMore,
		noResultsFound,
		fetchNotifications,
	};
};

export default useGetNotifications;
