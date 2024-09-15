// loadMessages.ts

import { getFirestore, doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";

import { Message, messageFromMap } from "../../constants/Models/Message";
import getChatId from "../../constants/Utils/getChatId";

/**
 * Loads messages between two users in real-time.
 * @param senderId The ID of the sender.
 * @param recipientId The ID of the recipient.
 * @param limit The maximum number of messages to load.
 * @param onMessages Callback function called with the list of messages.
 * @param onError Optional callback function called if an error occurs.
 * @returns A function to unsubscribe from the real-time updates.
 */
export const loadMessages = (
	senderId: string,
	recipientId: string,
	limit: number,
	onMessages: (messages: Message[]) => void,
	onError?: (error: any) => void,
): (() => void) => {
	const firestore = getFirestore(); // Get the Firestore instance
	const chatId = getChatId(senderId, recipientId);
	const docRef = doc(firestore, "chats", chatId);

	const unsubscribe = onSnapshot(
		docRef,
		(snapshot) => {
			if (!snapshot.exists()) {
				onMessages([]);
				return;
			}

			const data = snapshot.data();
			if (!data || !data.messages) {
				onMessages([]);
				return;
			}

			let messagesData = data.messages as Array<Record<string, any>>;
			messagesData.sort((a, b) => {
				const timeA = (a.createdAt as Timestamp).toDate().getTime();
				const timeB = (b.createdAt as Timestamp).toDate().getTime();
				return timeA - timeB;
			});

			// Load only the latest 'limit' messages
			if (messagesData.length > limit) {
				messagesData = messagesData.slice(-limit);
			}

			const messages = messagesData.map((messageData) => messageFromMap(messageData, snapshot));

			onMessages(messages);
		},
		(error) => {
			if (onError) {
				onError(error);
			} else {
				console.error(error);
			}
		},
	);

	return unsubscribe;
};

/**
 * Loads more messages for pagination.
 * @param userId The ID of the current user.
 * @param recipientId The ID of the recipient.
 * @param lastMessage The oldest message currently loaded.
 * @param limit The maximum number of additional messages to load.
 * @returns A promise that resolves to an array of messages.
 */
export const loadMoreMessages = async (
	userId: string,
	recipientId: string,
	lastMessage: Message,
	limit: number = 10,
): Promise<Message[]> => {
	const firestore = getFirestore(); // Get the Firestore instance
	const chatId = getChatId(userId, recipientId);
	const docRef = doc(firestore, "chats", chatId);
	const docSnapshot = await getDoc(docRef);
	const data = docSnapshot.data();

	if (!data || !data.messages) {
		return [];
	}

	const messagesData = data.messages as Array<Record<string, any>>;
	messagesData.sort((a, b) => {
		const timeA = (a.createdAt as Timestamp).toDate().getTime();
		const timeB = (b.createdAt as Timestamp).toDate().getTime();
		return timeA - timeB;
	});

	const lastTimestamp = lastMessage.createdAt.getTime();
	const lastIndex = messagesData.findIndex((messageData) => {
		const messageTimestamp = (messageData.createdAt as Timestamp).toDate().getTime();
		return messageTimestamp === lastTimestamp;
	});

	if (lastIndex <= 0) {
		return []; // No more messages to load
	}

	const startIndex = Math.max(0, lastIndex - limit);
	const olderMessagesData = messagesData.slice(startIndex, lastIndex);

	const messages = olderMessagesData.map((messageData) => messageFromMap(messageData, docSnapshot));

	return messages;
};
