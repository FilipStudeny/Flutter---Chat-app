import { DocumentSnapshot, Timestamp } from "firebase/firestore";

interface UserMessage {
	id: string;
	senderId: string;
	recipientId: string;
	text: string;
	createdAt: Timestamp;
}

export default UserMessage;

export function fromMap(data: any, snapshot: DocumentSnapshot): UserMessage {
	return {
		id: snapshot.id, // Use the Firestore document ID
		senderId: data.senderId,
		recipientId: data.recipientId,
		text: data.text,
		createdAt: data.createdAt,
		// Map other properties if available
	};
}
