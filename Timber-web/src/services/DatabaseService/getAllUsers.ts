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
	getDoc,
	doc,
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
	fetchFriends,
	userId,
}: {
	limit?: number;
	lastDocument?: DocumentSnapshot<DocumentData>;
	excludeId?: string;
	gender?: Gender;
	minAge?: number;
	maxAge?: number;
	username?: string;
	fetchFriends?: boolean;
	userId?: string;
} = {}): Promise<ServiceResponse<UserDataModel[]>> => {
	try {
		const usersCollection = collection(FirebaseFireStore, "users");
		let userQuery: Query<DocumentData>;

		if (fetchFriends && userId) {
			const userDoc = await getDoc(doc(FirebaseFireStore, "users", userId));

			if (!userDoc.exists()) {
				return { success: false, message: "User not found" };
			}

			const friends = (userDoc.data()?.friends as string[]) || [];

			if (friends.length === 0) {
				return { success: true, message: "No friends found", data: [] };
			}

			userQuery = query(usersCollection, where("__name__", "in", friends));
		} else {
			userQuery = query(usersCollection);
		}

		const filters: any[] = [];

		if (username) {
			filters.push(orderBy("username"));
			filters.push(where("username", ">=", username));
			filters.push(where("username", "<", `${username}\uf8ff`));
		} else {
			filters.push(orderBy("__name__"));
		}

		if (excludeId) {
			filters.push(where("__name__", "!=", excludeId));
		}

		if (gender) {
			filters.push(where("gender", "==", gender));
		}

		if (lastDocument) {
			const documentId = lastDocument as UserDataModel;
			filters.push(startAfter(documentId.uid));
		}

		userQuery = query(userQuery, ...filters, limit(resultLimit));

		const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userQuery);

		if (!querySnapshot.empty) {
			const users: UserDataModel[] = querySnapshot.docs
				.map((doc) => {
					const data = doc.data();

					return {
						uid: doc.id,
						aboutMe: data.aboutMe || "",
						age: data.age || calculateAge(data.dateOfBirth?.toDate()),
						dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000) : null,
						email: data.email || "",
						firstName: data.firstName || "",
						friends: data.friends || [],
						gender: data.gender,
						lastName: data.lastName || "",
						phoneNumber: data.phoneNumber || null,
						profilePictureUrl: data.profilePictureUrl || "",
						username: data.username || "",
						online: false, // Default value
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
