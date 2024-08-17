import { doc, updateDoc } from "firebase/firestore";

import { Gender } from "../../constants/Enums/Gender";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { genderToString, UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseFireStore } from "../../firebase";

const updateProfile = async (id: string, user: UserDataModel): Promise<ServiceResponse<boolean>> => {
	try {
		const userDocRef = doc(FirebaseFireStore, "users", id);

		await updateDoc(userDocRef, {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			profilePictureUrl: user.profilePictureUrl,
			gender: genderToString(user.gender as Gender),
			phoneNumber: user.phoneNumber,
			friends: user.friends,
			aboutMe: user.aboutMe,
			dateOfBirth: user.dateOfBirth,
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

export default updateProfile;
