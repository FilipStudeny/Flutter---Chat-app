import { getDatabase, ref, get } from "firebase/database";
import { useState, useEffect } from "react";

interface UserStatus {
	online: boolean;
	last_seen: number;
	location: string;
}

interface UseUserStatusResult {
	status: UserStatus | null;
	loading: boolean;
	error: string | null;
}

const useUserStatus = (uid: string): UseUserStatusResult => {
	const [status, setStatus] = useState<UserStatus | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchUserStatus = async () => {
			try {
				const database = getDatabase();
				const userStatusRef = ref(database, `/status/${uid}`);
				const snapshot = await get(userStatusRef);

				if (snapshot.exists()) {
					const data = snapshot.val();
					setStatus({
						online: data.online,
						last_seen: data.last_seen,
						location: data.location || "",
					});
				} else {
					setError("User status not found.");
				}
			} catch (error) {
				if (error instanceof Error) {
					setError(`Failed to retrieve user status: ${error.message}`);
				} else {
					setError("An unknown error occurred.");
				}
			} finally {
				setLoading(false);
			}
		};

		if (uid) {
			fetchUserStatus();
		} else {
			setError("Invalid user ID.");
			setLoading(false);
		}
	}, [uid]);

	return { status, loading, error };
};

export default useUserStatus;
