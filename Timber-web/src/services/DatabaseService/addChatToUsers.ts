import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import getChatId from "../../constants/Utils/getChatId";
import { FirebaseFireStore } from "../../firebase";

/**
 * Adds a chat between two users in Firestore and updates both users' chat lists.
 *
 * @param {string} currentUserId - The ID of the current user.
 * @param {string} recipientId - The ID of the recipient.
 * @param {string} currentUserName - The name of the current user.
 * @param {string} recipientName - The name of the recipient.
 * @returns {Promise<ServiceResponse<boolean>>} - A promise that resolves to a ServiceResponse indicating success or failure.
 */
const addChatToUsers = async (
	currentUserId: string,
	recipientId: string,
	currentUserName: string,
	recipientName: string,
): Promise<ServiceResponse<boolean>> => {
	try {
		const chatId = getChatId(currentUserId, recipientId);

		const currentUserDocRef = doc(FirebaseFireStore, "users", currentUserId);
		const recipientUserDocRef = doc(FirebaseFireStore, "users", recipientId);

		const chatDocRef = doc(FirebaseFireStore, "chats", chatId);

		const chatEntryForCurrentUser = {
			chatId,
			recipientName,
			recipientId,
		};

		const chatEntryForRecipient = {
			chatId,
			recipientName: currentUserName,
			recipientId: currentUserId,
		};

		const chatDocSnapshot = await getDoc(chatDocRef);
		if (!chatDocSnapshot.exists()) {
			await setDoc(chatDocRef, {
				messages: [],
				participants: [currentUserId, recipientId],
				createdAt: new Date(),
			});
		}

		await Promise.all([
			updateDoc(currentUserDocRef, {
				chatList: arrayUnion(chatEntryForCurrentUser),
			}),
			updateDoc(recipientUserDocRef, {
				chatList: arrayUnion(chatEntryForRecipient),
			}),
		]);

		return { data: true, success: true };
	} catch (err) {
		return {
			data: false,
			message: err instanceof Error ? err.message : String(err),
			success: false,
		};
	}
};

export default addChatToUsers;
