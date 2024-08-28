import { doc, deleteDoc } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";

async function deleteNotification(recipientId: string, notificationId: string): Promise<ServiceResponse<void>> {
	try {
		const notificationDocRef = doc(FirebaseFireStore, "users", recipientId, "notifications", notificationId);

		await deleteDoc(notificationDocRef);

		return { success: true };
	} catch (err) {
		let errorMessage = "An unknown error occurred";
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return { success: false, message: errorMessage };
	}
}

export default deleteNotification;
