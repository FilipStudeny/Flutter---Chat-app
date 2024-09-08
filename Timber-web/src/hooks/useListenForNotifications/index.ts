import { Firestore, collection, orderBy, query, where, limit, onSnapshot, doc, updateDoc } from "firebase/firestore";
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

			const unreadNotifications = notificationsData.filter((notification) => !notification.read);
			setUnreadCount(unreadNotifications.length);

			setNotifications(notificationsData.slice(0, 5));
		});

		return () => unsubscribe();
	}, [userId, notificationType]);

	const markAllAsRead = async () => {
		const db: Firestore = FirebaseFireStore;
		notifications.forEach(async (notification) => {
			if (!notification.read) {
				const notificationRef = doc(db, "users", userId, "notifications", notification.id);
				await updateDoc(notificationRef, { read: true });
			}
		});
		setUnreadCount(0);
	};

	const removeNotificationFromList = (notificationId: string) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((notification) => notification.id !== notificationId),
		);
	};

	const clearNotifications = () => {
		setNotifications([]);
		setUnreadCount(0);
	};

	return { notifications, unreadCount, clearNotifications, markAllAsRead, removeNotificationFromList };
};

export default useListenForNotifications;
