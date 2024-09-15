import {
	collection,
	doc,
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
import { useState, useEffect, useCallback } from "react";

import { Message, messageFromMap } from "../../constants/Models/Message";
import getChatId from "../../constants/Utils/getChatId";
import { FirebaseFireStore } from "../../firebase";

interface UseLoadChatMessagesResult {
	messages: Message[];
	loading: boolean;
	hasMore: boolean;
	error: string | null;
	loadMoreMessages: () => Promise<void>;
}

const useLoadChatMessages = (
	senderId: string,
	recipientId: string,
	initialLimit: number = 20,
): UseLoadChatMessagesResult => {
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [lastMessage, setLastMessage] = useState<Message | null>(null);
	const [hasMore, setHasMore] = useState<boolean>(true);

	// Load initial messages with real-time updates
	const loadMessages = useCallback(() => {
		setLoading(true);
		const chatId = getChatId(senderId, recipientId);
		const chatDocRef = doc(collection(FirebaseFireStore, "chats"), chatId);

		const unsubscribe = onSnapshot(
			chatDocRef,
			(snapshot: DocumentSnapshot<DocumentData>) => {
				if (!snapshot.exists()) {
					setMessages([]);
					setLoading(false);
					return;
				}

				const data = snapshot.data();
				if (!data || !data.messages) {
					setMessages([]);
					setLoading(false);
					return;
				}

				let messagesData: Array<any> = data.messages;
				// Sort messages by `createdAt`
				messagesData.sort(
					(a, b) => (b.createdAt as Timestamp).toMillis() - (a.createdAt as Timestamp).toMillis(),
				);

				// Limit the messages to the first `initialLimit` messages
				messagesData = messagesData.slice(0, initialLimit);

				const loadedMessages = messagesData.map((messageData: any) => messageFromMap(messageData, snapshot));

				// Set messages and last message for pagination
				setMessages(loadedMessages);
				setLastMessage(loadedMessages[loadedMessages.length - 1] || null);
				setHasMore(loadedMessages.length >= initialLimit);
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			},
		);

		return () => unsubscribe();
	}, [senderId, recipientId, initialLimit]);

	// Load more messages (pagination)
	const loadMoreMessages = useCallback(async () => {
		if (!lastMessage || !hasMore || loading) return;

		setLoading(true);

		try {
			const chatId = getChatId(senderId, recipientId);
			const lastTimestamp = lastMessage.createdAt;

			const messagesQuery = query(
				collection(FirebaseFireStore, `chats/${chatId}/messages`),
				orderBy("createdAt", "desc"),
				startAfter(lastTimestamp),
				firestoreLimit(initialLimit),
			);

			const querySnapshot = await getDocs(messagesQuery);
			const moreMessages = querySnapshot.docs.map((doc) => messageFromMap(doc.data(), doc));

			if (moreMessages.length > 0) {
				setMessages((prevMessages) => [...prevMessages, ...moreMessages]);
				setLastMessage(moreMessages[moreMessages.length - 1]);
			}

			// If less than the limit of messages are returned, assume there are no more messages
			setHasMore(moreMessages.length >= initialLimit);
		} catch (err) {
			const errorMessage = (err as Error).message || "Failed to load more messages.";
			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	}, [senderId, recipientId, lastMessage, hasMore, loading, initialLimit]);

	// Effect to load the initial messages
	useEffect(() => {
		loadMessages();
	}, [loadMessages]);

	return {
		messages,
		loading,
		hasMore,
		error,
		loadMoreMessages,
	};
};

export default useLoadChatMessages;
