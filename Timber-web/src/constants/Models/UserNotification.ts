import { Timestamp, DocumentData } from "firebase/firestore"; // Import from firebase/firestore

import NotificationType from "../Enums/NotificationType";

interface UserNotification {
	senderId: string;
	recipientId: string;
	message: string;
	type: NotificationType;
	createdAt: Timestamp;
	id: string;
	read: boolean;
}

export default UserNotification;
export const mapFirestoreDocToUserNotification = (doc: DocumentData): UserNotification => ({
    senderId: doc.senderId,
    recipientId: doc.recipientId,
    message: doc.message,
    type: doc.type as NotificationType,
    createdAt: doc.createdAt as Timestamp,
    id: doc.id,
    read: doc.read,
});
