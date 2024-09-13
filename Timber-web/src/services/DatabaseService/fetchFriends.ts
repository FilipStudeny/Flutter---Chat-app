import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";

const fetchFriends = async (userId: string): Promise<ServiceResponse<string[]>> => {
	try {
		const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(FirebaseFireStore, "users", userId));

		if (!userDoc.exists()) {
			return { success: false, message: "User not found" };
		}

		const data = userDoc.data();
		const friends: string[] = data?.friends || [];

		return { success: true, data: friends };
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
		return { success: false, message: errorMessage };
	}
};

export default fetchFriends;
