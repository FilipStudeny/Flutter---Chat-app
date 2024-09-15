import { Timestamp, collection, doc, updateDoc, setDoc, FirestoreError, arrayUnion } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import getChatId from "../../constants/Utils/getChatId";
import { FirebaseAuth, FirebaseFireStore } from "../../firebase";
import { FileMetadata, uploadFile } from "../FileStorageService/uploadFile";

interface ChatMessage {
	text: string | null;
	createdAt: Timestamp | Date;
	senderId: string;
	recipientId: string;
	username: string;
	userImage: string | null;
	file: FileMetadata | null;
}

const sendFileMessage = async (
	sender: UserDataModel,
	recipient: UserDataModel,
	file: File,
): Promise<ServiceResponse<void>> => {
	try {
		if (file.size > 250 * 1024 * 1024) {
			return { data: undefined, message: "File size exceeds 250 MB.", success: false };
		}

		const chatId = getChatId(sender.uid as string, recipient.uid as string);
		const fileName = `${Date.now()}_${file.name}`;

		const uploadResponse = await uploadFile(file, `chats/${chatId}/files`, fileName);

		if (!uploadResponse.success) {
			return { data: undefined, message: uploadResponse.message || "File upload failed.", success: false };
		}

		const fileMetadata = uploadResponse.data;

		const newMessage: ChatMessage = {
			text: null,
			createdAt: Timestamp.now(),
			senderId: sender.uid as string,
			recipientId: recipient.uid as string,
			username: FirebaseAuth.currentUser?.displayName || "Anonymous",
			userImage: FirebaseAuth.currentUser?.photoURL || null,
			file: fileMetadata
				? {
						url: fileMetadata.url,
						size: fileMetadata.size,
						type: fileMetadata.type,
						name: fileMetadata.name,
					}
				: null,
		};

		const chatDocRef = doc(collection(FirebaseFireStore, "chats"), chatId);

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

export default sendFileMessage;
