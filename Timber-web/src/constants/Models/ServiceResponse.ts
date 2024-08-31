import { DocumentData, DocumentSnapshot } from "firebase/firestore";

export interface ServiceResponse<T> {
	success: boolean;
	message?: string;
	data?: T;
	lastDocumentSnapshot?: DocumentSnapshot<DocumentData>;
}
