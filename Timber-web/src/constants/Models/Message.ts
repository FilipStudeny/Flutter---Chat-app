// Message.ts
import { Timestamp, DocumentSnapshot } from "firebase/firestore";

import { FileMetadata, fileMetadataFromMap, fileMetadataToMap } from "./FileMetadata";

export interface Message {
	id: string;
	text: string;
	senderId: string;
	recipientId: string;
	username: string;
	userImage?: string | null;
	file?: FileMetadata | null;
	createdAt: Date;
	documentSnapshot: DocumentSnapshot;
}

export const messageFromMap = (map: Record<string, any>, doc: DocumentSnapshot): Message => ({
	id: map.id,
	text: map.text,
	senderId: map.senderId,
	recipientId: map.recipientId,
	username: map.username,
	userImage: map.userImage || null,
	file: map.file ? fileMetadataFromMap(map.file) : null,
	createdAt: (map.createdAt as Timestamp).toDate(),
	documentSnapshot: doc,
});

export const messageToMap = (message: Message): Record<string, any> => ({
	id: message.id,
	text: message.text,
	senderId: message.senderId,
	recipientId: message.recipientId,
	username: message.username,
	userImage: message.userImage,
	file: message.file ? fileMetadataToMap(message.file) : null,
	createdAt: Timestamp.fromDate(message.createdAt),
});
