import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import sendMessage from "../../services/MessagingService/sendMessage";

interface UseSendMessageProps {
	sender: UserDataModel;
	recipient: UserDataModel;
	initialMessage?: string;
}

interface UseSendMessage {
	loading: boolean;
	error: string | null;
	success: boolean;
	sendMessageToUser: (message: string) => Promise<void>;
	resetState: () => void;
}

const useSendMessage = ({ sender, recipient, initialMessage = "" }: UseSendMessageProps): UseSendMessage => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [message, setMessage] = useState<string>(initialMessage);

	const sendMessageToUser = async (newMessage: string = message) => {
		if (loading) return;

		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response: ServiceResponse<void> = await sendMessage(sender, recipient, newMessage);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Failed to send message.");
			}
		} catch (err) {
			setError("An error occurred while sending the message.");
		} finally {
			setLoading(false);
		}
	};

	const resetState = () => {
		setMessage("");
		setError(null);
		setSuccess(false);
	};

	return {
		loading,
		error,
		success,
		sendMessageToUser,
		resetState,
	};
};

export default useSendMessage;
