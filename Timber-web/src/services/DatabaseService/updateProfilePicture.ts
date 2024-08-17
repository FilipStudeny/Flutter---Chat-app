import { doc, updateDoc } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";

const updateProfilePicture = async (id: string, profilePictureUrl: string): Promise<ServiceResponse<boolean>> => {
	try {
		const userDocRef = doc(FirebaseFireStore, "users", id);

		await updateDoc(userDocRef, {
			profilePictureUrl,
		});

		return { data: true, success: true };
	} catch (err) {
		return {
			data: false,
			message: err instanceof Error ? err.message : String(err),
			success: false,
		};
	}
};

export default updateProfilePicture;
