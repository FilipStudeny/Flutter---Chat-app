import { getDatabase, ref, get } from "firebase/database";

interface UserStatus {
	online: boolean;
	last_seen: number;
	location: string;
}

const getUserStatus = async (uid: string): Promise<{ success: boolean; data?: UserStatus; message?: string }> => {
	try {
		const database = getDatabase();
		const userStatusRef = ref(database, `/status/${uid}`);

		const snapshot = await get(userStatusRef);

		if (snapshot.exists()) {
			const data = snapshot.val();
			return {
				success: true,
				data: {
					online: data.online,
					last_seen: data.last_seen,
					location: data.location || "",
				},
			};
		}
		return { success: false, message: "User status not found." };
	} catch (error) {
		if (error instanceof Error) {
			return { success: false, message: `Failed to retrieve user status: ${error.message}` };
		}
		return { success: false, message: "An unknown error occurred." };
	}
};

export default getUserStatus;
