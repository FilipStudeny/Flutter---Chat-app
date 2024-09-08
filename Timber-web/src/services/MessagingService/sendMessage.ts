import { Timestamp, collection, doc, updateDoc, setDoc, FirestoreError, arrayUnion } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import getChatId from "../../constants/Utils/getChatId";
import { FirebaseAuth, FirebaseFireStore } from "../../firebase";

interface ChatMessage {
	text: string;
	createdAt: Timestamp | Date;
	senderId: string;
	recipientId: string;
	username: string;
	userImage: string | null;
	file: null | string;
}

const sendMessage = async (
	sender: UserDataModel,
	recipient: UserDataModel,
	message: string,
): Promise<ServiceResponse<void>> => {
	try {
		const chatId = getChatId(sender.uid as string, recipient.uid as string);
		const chatDocRef = doc(collection(FirebaseFireStore, "chats"), chatId);

		const newMessage: ChatMessage = {
			text: message,
			createdAt: Timestamp.now(),
			senderId: sender.uid as string,
			recipientId: recipient.uid as string,
			username: FirebaseAuth.currentUser?.displayName || "Anonymous",
			userImage: FirebaseAuth.currentUser?.photoURL || null,
			file: null,
		};

		await updateDoc(chatDocRef, {
			messages: arrayUnion(newMessage),
		}).catch(async (error: FirestoreError) => {
			if (error.code === "not-found") {
				await setDoc(chatDocRef, {
					messages: [newMessage],
				});
			} else {
				throw error;
			}
		});

		return { data: undefined, success: true };
	} catch (err: any) {
		return { data: undefined, message: err.message, success: false };
	}
};

export default sendMessage;
