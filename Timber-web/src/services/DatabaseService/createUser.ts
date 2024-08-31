import { doc, setDoc, Timestamp } from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseFireStore } from "../../firebase";

const createUser = async (id: string, user: UserDataModel): Promise<ServiceResponse<boolean>> => {
	try {
		await setDoc(doc(FirebaseFireStore, "users", id), {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			profilePictureUrl: user.profilePictureUrl,
			gender: user.gender,
			phoneNumber: user.phoneNumber,
			friends: user.friends,
			aboutMe: user.aboutMe,
			dateOfBirth: user.dateOfBirth ? Timestamp.fromDate(user.dateOfBirth) : null,
		});

		return { success: true, data: true };
	} catch (err) {
		return {
			success: false,
			data: false,
			message: err instanceof Error ? err.message : "An unknown error occurred",
		};
	}
};

export default createUser;
