import { Timestamp, collection, doc, updateDoc, setDoc, FirestoreError, arrayUnion } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseAuth, FirebaseFireStore } from "../../firebase"; // Import Firestore instance correctly
import getChatId from "../../constants/Utils/getChatId";

// Define a type for the message structure
interface ChatMessage {
	text: string;
	createdAt: Timestamp | Date;
	senderId: string;
	recipientId: string;
	username: string;
	userImage: string | null;
	file: null | string; // Adjust as needed for file support
}


// sendMessage function
const sendMessage = async (
	sender: UserDataModel,
	recipient: UserDataModel,
	message: string,
): Promise<ServiceResponse<void>> => {
	try {
		const chatId = getChatId(sender.uid as string, recipient.uid as string); // Function to get or generate a chat ID
		const chatDocRef = doc(collection(FirebaseFireStore, "chats"), chatId); // Correct way to get a document reference

		const newMessage: ChatMessage = {
			text: message,
			createdAt: Timestamp.now(), // Use Firestore Timestamp
			senderId: sender.uid as string,
			recipientId: recipient.uid as string,
			username: FirebaseAuth.currentUser?.displayName || "Anonymous",
			userImage: FirebaseAuth.currentUser?.photoURL || null,
			file: null, // Handle attachments as needed
		};

		// Attempt to update the chat document with the new message
		await updateDoc(chatDocRef, {
			messages: arrayUnion(newMessage), // Use arrayUnion from Firestore module
		}).catch(async (error: FirestoreError) => {
			if (error.code === "not-found") {
				// If the document doesn't exist, create it
				await setDoc(chatDocRef, {
					messages: [newMessage],
				});
			} else {
				throw error;
			}
		});

		return { data: undefined, success: true }; // Return 'undefined' instead of 'null'
	} catch (err: any) {
		return { data: undefined, message: err.message, success: false }; // Return 'undefined' instead of 'null'
	}
};

export default sendMessage;
