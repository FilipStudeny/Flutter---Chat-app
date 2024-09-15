import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import sendFileMessage from "../../services/MessagingService/sendFileMessage";

interface UseSendFileMessageProps {
	sender: UserDataModel;
	recipient: UserDataModel;
}

interface UseSendFileMessage {
	loading: boolean;
	error: string | null;
	success: boolean;
	sendFileToUser: (file: File) => Promise<void>;
	resetState: () => void;
}

const useSendFileMessage = ({ sender, recipient }: UseSendFileMessageProps): UseSendFileMessage => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const sendFileToUser = async (file: File) => {
		if (loading) return;

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response: ServiceResponse<void> = await sendFileMessage(sender, recipient, file);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Failed to send file.");
			}
		} catch (err) {
			setError("An error occurred while sending the file.");
		} finally {
			setLoading(false);
		}
	};

	const resetState = () => {
		setError(null);
		setSuccess(false);
	};

	return {
		loading,
		error,
		success,
		sendFileToUser,
		resetState,
	};
};

export default useSendFileMessage;
