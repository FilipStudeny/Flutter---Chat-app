import {
	collection,
	DocumentData,
	Query,
	QuerySnapshot,
	query,
	where,
	startAfter,
	limit,
	DocumentSnapshot,
	getDocs,
} from "firebase/firestore";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseFireStore } from "../../firebase";
import { Gender } from "../../constants/Enums/Gender";

const getAllUsers = async ({
	limit: resultLimit = 10,
	lastDocument,
	excludeId,
	gender,
}: {
	limit?: number;
	lastDocument?: DocumentSnapshot<DocumentData>;
	excludeId?: string;
	gender?: Gender;
} = {}): Promise<ServiceResponse<UserDataModel[]>> => {
	try {
		const usersCollection = collection(FirebaseFireStore, "users");

		// Base query: excludeId if provided, else query all users
		let userQuery: Query<DocumentData> = query(
			usersCollection,
			excludeId ? where("__name__", "!=", excludeId) : where("__name__", ">=", ""), // use ">=" if no excludeId
			limit(resultLimit),
		);

		// Add gender filter if specified
		if (gender) {
			userQuery = query(userQuery, where("gender", "==", gender));
		}

		// Pagination: start after the last document if provided
		if (lastDocument) {
			userQuery = query(userQuery, startAfter(lastDocument));
		}

		const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userQuery);

		if (!querySnapshot.empty) {
			const users: UserDataModel[] = querySnapshot.docs.map((doc) => {
				const data = doc.data();

				return {
					aboutMe: data.aboutMe || "",
					age: data.age || 0,
					dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000) : new Date(),
					email: data.email || "",
					firstName: data.firstName || "",
					friends: data.friends || [],
					gender: data.gender,
					lastName: data.lastName || "",
					phoneNumber: data.phoneNumber || null,
					profilePictureUrl: data.profilePictureUrl || "",
					username: data.username || "",
				} as UserDataModel;
			});

			return { success: true, data: users };
		}
		return { success: false, message: "No users found" };
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
		return { success: false, message: errorMessage };
	}
};

export default getAllUsers;
