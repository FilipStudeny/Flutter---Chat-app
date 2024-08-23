import {
	getFirestore,
	Firestore,
	QueryDocumentSnapshot,
	QuerySnapshot,
	DocumentData,
	collection,
	orderBy,
	query,
	onSnapshot, // Import onSnapshot
} from "firebase/firestore";

import UserNotification, { mapFirestoreDocToUserNotification } from "../../constants/Models/UserNotification";

const getAllNotifications = (userId: string, callback: (notifications: UserNotification[]) => void) => {
	const db: Firestore = getFirestore(); // Get Firestore instance

	const notificationsQuery = query(collection(db, "users", userId, "notifications"), orderBy("createdAt", "desc"));

	const unsubscribe = onSnapshot(
		notificationsQuery,
		(snapshot: QuerySnapshot<DocumentData>) => {
			const notifications = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
				mapFirestoreDocToUserNotification({ ...doc.data(), id: doc.id }),
			);
			callback(notifications);
		},
		(error) => {
			console.error("Error fetching notifications: ", error);
		},
	);

	return unsubscribe; // Return the unsubscribe function to stop listening when needed
};

export default getAllNotifications;
