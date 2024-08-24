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

import UserMessage, { fromMap } from "../../constants/Models/UserMessage"; // Adjust the path as necessary

// Function to load messages with real-time updates
const loadMessages = (
	senderId: string,
	recipientId: string,
	callback: (messages: UserMessage[]) => void,
	limit: number = 20,
) => {
	const db: Firestore = getFirestore(); // Initialize Firestore instance

	// Generate the chat ID from sender and recipient IDs
	const chatId = `${senderId}_${recipientId}`;
	// Create a query to get messages from the "chats" collection, ordered by creation date
	const messagesQuery = query(
		collection(db, "chats", chatId, "messages"), // Assuming messages are stored in a subcollection under chats
		orderBy("createdAt", "desc"), // Order by createdAt in descending order
		firestoreLimit(limit), // Limit the number of results
	);

	// Listen to real-time updates using onSnapshot
	const unsubscribe = onSnapshot(
		messagesQuery,
		(snapshot: QuerySnapshot<DocumentData>) => {
			// Map each Firestore document to a UserMessage instance using fromMap
			const messages = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) =>
				fromMap({ ...doc.data(), id: doc.id }, doc),
			);
			// Execute the callback function with the list of messages
			callback(messages);
		},
		(error) => {
			console.error("Error fetching messages: ", error);
		},
	);

	return unsubscribe; // Return the unsubscribe function to stop listening for real-time updates
};

export default loadMessages;
