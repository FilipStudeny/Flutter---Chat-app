import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";

async function removeFriend(userId: string, friendId: string): Promise<ServiceResponse<void>> {
	try {
		const userDocRef = doc(FirebaseFireStore, "users", userId);
		const userSnapshot = await getDoc(userDocRef);

		if (userSnapshot.exists()) {
			const userFriends = userSnapshot.get("friends") ?? [];
			if (userFriends.includes(friendId)) {
				await updateDoc(userDocRef, {
					friends: arrayRemove(friendId),
				});
			}
		}

		const friendDocRef = doc(FirebaseFireStore, "users", friendId);
		const friendSnapshot = await getDoc(friendDocRef);

		if (friendSnapshot.exists()) {
			const friendFriends = friendSnapshot.get("friends") ?? [];
			if (friendFriends.includes(userId)) {
				await updateDoc(friendDocRef, {
					friends: arrayRemove(userId),
				});
			}
		}

		return { success: true };
	} catch (err) {
		let errorMessage = "An unknown error occurred";
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return { success: false, message: errorMessage };
	}
}

export default removeFriend;
