import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseFireStore } from "../../firebase";

const getUser = async (userId: string): Promise<ServiceResponse<UserDataModel>> => {
	try {
		const userDoc: DocumentSnapshot<DocumentData> = await getDoc(doc(FirebaseFireStore, "users", userId));

		if (!userDoc.exists()) {
			return { success: false, message: "User not found" };
		}

		const data = userDoc.data();
		const user: UserDataModel = {
			uid: userDoc.id,
			profilePictureUrl: data?.profilePictureUrl || "",
			username: data?.username || "",
			gender: data?.gender,
			email: data?.email || "",
			firstName: data?.firstName || "",
			lastName: data?.lastName || "",
			phoneNumber: data?.phoneNumber || null,
			aboutMe: data?.aboutMe || "",
			friends: data?.friends || [],
			dateOfBirth: data?.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000) : undefined,
		};

		return { success: true, data: user };
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
		return { success: false, message: errorMessage };
	}
};

export default getUser;
