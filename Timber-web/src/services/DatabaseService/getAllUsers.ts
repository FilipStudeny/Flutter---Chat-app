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
	orderBy,
} from "firebase/firestore";

import { Gender } from "../../constants/Enums/Gender";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { calculateAge, UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseFireStore } from "../../firebase";

const getAllUsers = async ({
	limit: resultLimit = 10,
	lastDocument,
	excludeId,
	gender,
	minAge,
	maxAge,
	username,
}: {
	limit?: number;
	lastDocument?: DocumentSnapshot<DocumentData>;
	excludeId?: string;
	gender?: Gender;
	minAge?: number;
	maxAge?: number;
	username?: string;
} = {}): Promise<ServiceResponse<UserDataModel[]>> => {
	try {
		const usersCollection = collection(FirebaseFireStore, "users");

		// Base query: Start with ordering by __name__ for pagination
		let userQuery: Query<DocumentData> = query(usersCollection, orderBy("__name__"), limit(resultLimit));

		const filters = [];

		// Exclude a specific ID if provided
		if (excludeId) {
			filters.push(where("__name__", "!=", excludeId));
		}

		// Add username filter if specified
		if (username) {
			filters.push(where("username", "==", username));
		}

		// Add gender filter if specified
		if (gender) {
			filters.push(where("gender", "==", gender));
		}

		// Combine filters with the base query
		if (filters.length > 0) {
			userQuery = query(userQuery, ...filters);
		}

		// Pagination: start after the last document if provided
		if (lastDocument) {
			userQuery = query(userQuery, startAfter(lastDocument));
		}

		// Execute the query
		const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userQuery);

		if (!querySnapshot.empty) {
			const users: UserDataModel[] = querySnapshot.docs
				.map((doc) => {
					const data = doc.data();

					return {
						uid: doc.id,
						aboutMe: data.aboutMe || "",
						age: data.age || 0,
						dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000) : null,
						email: data.email || "",
						firstName: data.firstName || "",
						friends: data.friends || [],
						gender: data.gender,
						lastName: data.lastName || "",
						phoneNumber: data.phoneNumber || null,
						profilePictureUrl: data.profilePictureUrl || "",
						username: data.username || "",
					} as UserDataModel;
				})
				.filter((user) => {
					if (minAge !== undefined && maxAge !== undefined) {
						if (user.dateOfBirth) {
							const userAge = calculateAge(user.dateOfBirth as Date);
							if (userAge !== undefined) {
								return userAge >= minAge && userAge <= maxAge;
							}
						}
						return false;
					}
					return true;
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
