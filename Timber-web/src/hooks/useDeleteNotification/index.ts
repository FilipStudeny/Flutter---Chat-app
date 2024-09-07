import { useState, useCallback } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import deleteNotification from "../../services/NotificationsService/deleteNotification";

interface UseDeleteNotification {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	deleteNotificationById: (recipientId: string, notificationId: string) => Promise<ServiceResponse<void>>;
}

const useDeleteNotification = (): UseDeleteNotification => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	const deleteNotificationById = useCallback(
		async (recipientId: string, notificationId: string): Promise<ServiceResponse<void>> => {
			setLoading(true);
			setError(null);
			setSuccess(null);

			try {
				const response = await deleteNotification(recipientId, notificationId);
				if (response.success) {
					setSuccess(true);
				} else {
					setError(response.message || "Failed to delete notification");
					setSuccess(false);
				}
				return response;
			} catch (err) {
				setError("An error occurred while deleting the notification.");
				setSuccess(false);
				return { success: false, message: "An error occurred while deleting the notification." };
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		loading,
		error,
		success,
		deleteNotificationById,
	};
};

export default useDeleteNotification;
