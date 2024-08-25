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
		// Define the new notification object
		const newNotification: UserNotification = {
			senderId,
			recipientId,
			message,
			type,
			createdAt: Timestamp.now(), // Use Firestore's Timestamp class
			read: false,
			id: "", // The document ID will be auto-generated by Firestore
		};

		// Reference to the user's notifications subcollection
		const notificationsCollectionRef = collection(FirebaseFireStore, "users", recipientId, "notifications");

		// Add a new document to the notifications subcollection
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