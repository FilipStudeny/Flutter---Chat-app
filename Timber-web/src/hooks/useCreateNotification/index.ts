import { useState } from "react";

import NotificationType from "../../constants/Enums/NotificationType";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import createNotification from "../../services/NotificationsService/createNotification";

interface UseCreateNotification {
	loading: boolean;
	error: string | null;
	success: boolean;
	sendNotification: (senderId: string, recipientId: string, message: string, type: NotificationType) => Promise<void>;
}

const useCreateNotification = (): UseCreateNotification => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const sendNotification = async (
		senderId: string,
		recipientId: string,
		message: string,
		type: NotificationType,
	): Promise<void> => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response: ServiceResponse<void> = await createNotification(senderId, recipientId, message, type);
			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error sending notification.");
			}
		} catch (err) {
			setError("An error occurred while sending the notification.");
		} finally {
			setLoading(false);
		}
	};

	return { loading, error, success, sendNotification };
};

export default useCreateNotification;
