import { useState, useEffect } from "react";

import NotificationType from "../../constants/Enums/NotificationType";
import useGetNotifications from "../useGetNotifications";

function useNotificationsListFetch(userId: string | undefined) {
	const [notificationType, setNotificationType] = useState<NotificationType | "">(""); // Filter for notification type
	const { loading, error, notifications, hasMore, noResultsFound, fetchNotifications } = useGetNotifications({
		notificationType,
		userId: userId || "",
	});

	const handleLoadMore = () => {
		fetchNotifications(false);
	};

	useEffect(() => {
		fetchNotifications(true);
	}, [userId, notificationType]);

	return {
		notificationType,
		setNotificationType,
		loading,
		error,
		notifications,
		hasMore,
		noResultsFound,
		handleLoadMore,
		fetchNotifications,
	};
}

export default useNotificationsListFetch;
