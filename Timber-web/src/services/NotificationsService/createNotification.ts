import { collection, addDoc, Timestamp } from "firebase/firestore";

import NotificationType from "../../constants/Enums/NotificationType";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import UserNotification from "../../constants/Models/UserNotification";
import { FirebaseFireStore } from "../../firebase";

async function createNotification(
	senderId: string,
	recipientId: string,
	message: string,
	type: NotificationType,
): Promise<ServiceResponse<void>> {
	try {
		const newNotification: UserNotification = {
			senderId,
			recipientId,
			message,
			type,
			createdAt: Timestamp.now(),
			read: false,
			id: "",
		};

		const notificationsCollectionRef = collection(FirebaseFireStore, "users", recipientId, "notifications");

		await addDoc(notificationsCollectionRef, newNotification);

		return { success: true };
	} catch (err) {
		let errorMessage = "An unknown error occurred";
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return { success: false, message: errorMessage };
	}
}

export default createNotification;
