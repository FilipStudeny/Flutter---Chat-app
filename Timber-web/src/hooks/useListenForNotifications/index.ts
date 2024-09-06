import { Firestore, collection, orderBy, query, where, limit, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";

import NotificationType from "../../constants/Enums/NotificationType";
import UserNotification, { mapFirestoreDocToUserNotification } from "../../constants/Models/UserNotification";
import { FirebaseFireStore } from "../../firebase";

interface GetNotificationsOptions {
	userId: string;
	notificationType?: NotificationType | "";
}

const useListenForNotifications = ({ userId, notificationType = "" }: GetNotificationsOptions) => {
	const [notifications, setNotifications] = useState<UserNotification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);

	useEffect(() => {
		const db: Firestore = FirebaseFireStore;
		let notificationsQuery = query(
			collection(db, "users", userId, "notifications"),
			orderBy("createdAt", "desc"),
			limit(100),
		);

		if (notificationType) {
			notificationsQuery = query(
				collection(db, "users", userId, "notifications"),
				where("type", "==", notificationType),
				orderBy("createdAt", "desc"),
				limit(100),
			);
		}

		const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
			const notificationsData = snapshot.docs.map((doc) =>
				mapFirestoreDocToUserNotification({ ...doc.data(), id: doc.id }),
			);

			setNotifications(notificationsData.slice(0, 5));
			setUnreadCount(notificationsData.length > 5 ? notificationsData.length - 5 : 0);
		});

		return () => unsubscribe();
	}, [userId, notificationType]);

	return { notifications, unreadCount };
};

export default useListenForNotifications;
