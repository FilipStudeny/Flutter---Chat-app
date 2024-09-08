import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	DocumentData,
	DocumentSnapshot,
	Timestamp,
	query,
	orderBy,
	limit as firestoreLimit,
	startAfter,
	getDocs,
} from "firebase/firestore";

import { Message, messageFromMap } from "../../constants/Models/Message";
import getChatId from "../../constants/Utils/getChatId";
import { FirebaseFireStore } from "../../firebase";

const loadMessages = (senderId: string, recipientId: string, limit: number = 20): Promise<Message[]> => {
	const chatId = getChatId(senderId, recipientId);
	const chatDocRef = doc(collection(FirebaseFireStore, "chats"), chatId);

	return new Promise((resolve, reject) => {
		onSnapshot(
			chatDocRef,
			(snapshot: DocumentSnapshot<DocumentData>) => {
				if (!snapshot.exists()) {
					resolve([]);
					return;
				}

				const data = snapshot.data();
				if (!data || !data.messages) {
					resolve([]);
					return;
				}

				let messagesData: Array<any> = data.messages;

				messagesData.sort(
					(a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis(),
				);

				messagesData = messagesData.slice(0, limit);

				const messages = messagesData.map((messageData: any) => messageFromMap(messageData, snapshot));

				resolve(messages);
			},
			reject,
		);
	});
};

const loadMoreMessages = async (
	senderId: string,
	recipientId: string,
	lastMessageData: any,
	limit: number = 20,
): Promise<Message[]> => {
	try {
		const chatId = getChatId(senderId, recipientId);
		const chatCollectionRef = collection(FirebaseFireStore, "chats");
		const chatDocRef = doc(chatCollectionRef, chatId);
		const chatSnapshot = await getDoc(chatDocRef);

		if (!chatSnapshot.exists()) {
			return [];
		}

		const lastTimestamp = lastMessageData.createdAt as Timestamp;

		const messagesQuery = query(
			collection(FirebaseFireStore, `chats/${chatId}/messages`),
			orderBy("createdAt", "desc"),
			startAfter(lastTimestamp),
			firestoreLimit(limit),
		);

		const querySnapshot = await getDocs(messagesQuery);
		const moreMessages = querySnapshot.docs.map((doc) => messageFromMap(doc.data(), doc));

		return moreMessages;
	} catch (error) {
		console.error("Error loading more messages: ", error);
		return [];
	}
};

export { loadMessages, loadMoreMessages };
