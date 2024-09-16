import {
	getFirestore,
	Firestore,
	collection,
	query,
	orderBy,
	limit as firestoreLimit,
	onSnapshot,
	QuerySnapshot,
	DocumentData,
	QueryDocumentSnapshot,
} from "firebase/firestore";

import UserMessage, { fromMap } from "../../constants/Models/UserMessage";

const loadMessages = (
	senderId: string,
	recipientId: string,
	callback: (messages: UserMessage[]) => void,
	limit: number = 20,
) => {
	const db: Firestore = getFirestore();

	const chatId = `${senderId}_${recipientId}`;
	const messagesQuery = query(
		collection(db, "chats", chatId, "messages"),
		orderBy("createdAt", "desc"),
		firestoreLimit(limit),
	);

	const unsubscribe = onSnapshot(
		messagesQuery,
		(snapshot: QuerySnapshot<DocumentData>) => {
			const messages = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
				fromMap({ ...doc.data(), id: doc.id }, doc),
			);
			callback(messages);
		},
		(error) => {
			console.error("Error fetching messages: ", error);
		},
	);

	return unsubscribe;
};

export default loadMessages;
