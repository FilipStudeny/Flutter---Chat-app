import {
	Firestore,
	collection,
	orderBy,
	query,
	where,
	startAfter,
	limit,
	QuerySnapshot,
	DocumentSnapshot,
	DocumentData,
	getDocs,
} from "firebase/firestore";

import NotificationType from "../../constants/Enums/NotificationType";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import UserNotification, { mapFirestoreDocToUserNotification } from "../../constants/Models/UserNotification";
import { FirebaseFireStore } from "../../firebase";

interface GetNotificationsOptions {
	userId: string;
	notificationType?: NotificationType | "";
	pageSize: number;
	lastDocument?: DocumentSnapshot<DocumentData>;
}

const getNotifications = async ({
	userId,
	notificationType = "",
	pageSize,
	lastDocument,
}: GetNotificationsOptions): Promise<ServiceResponse<UserNotification[]>> => {
	try {
		const db: Firestore = FirebaseFireStore;

		let notificationsQuery = query(
			collection(db, "users", userId, "notifications"),
			orderBy("createdAt", "desc"),
			limit(pageSize),
		);

		if (notificationType) {
			notificationsQuery = query(
				collection(db, "users", userId, "notifications"),
				where("type", "==", notificationType),
				orderBy("createdAt", "desc"),
				limit(pageSize),
			);
		}

		if (lastDocument) {
			notificationsQuery = query(notificationsQuery, startAfter(lastDocument));
		}

		const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(notificationsQuery);

		const notifications = querySnapshot.docs.map((doc) =>
			mapFirestoreDocToUserNotification({ ...doc.data(), id: doc.id }),
		);

		const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

		if (notifications.length > 0) {
			return {
				success: true,
				data: notifications,
				lastDocumentSnapshot: lastVisible,
			};
		}

		return {
			success: false,
			message: "No notifications found",
		};
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
		return {
			success: false,
			message: errorMessage,
		};
	}
};

export default getNotifications;
