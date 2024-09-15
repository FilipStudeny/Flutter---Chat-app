import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

interface GetUserStatus {
	online: boolean;
	last_seen: number | undefined;
	location: string | undefined;
}

interface GetUserStatusResult {
	status: GetUserStatus | null;
	loading: boolean;
	error: string | null;
}

const useGetUserStatus = (uid: string): GetUserStatusResult => {
	const [status, setStatus] = useState<GetUserStatus | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!uid) {
			setError("Invalid user ID.");
			setLoading(false);
			return () => {}; // Return a no-op cleanup function
		}

		const database = getDatabase();
		const userStatusRef = ref(database, `/status/${uid}`);

		const handleValueChange = (snapshot: any) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				setStatus({
					online: data.online,
					last_seen: data.last_seen,
					location: data.location || "",
				});
			} else {
				setStatus({
					online: false,
					last_seen: undefined,
					location: undefined,
				});
			}
			setError(null);
			setLoading(false);
		};

		const handleError = (error: any) => {
			setError(`Failed to retrieve user status: ${error.message}`);
			setLoading(false);
		};

		// Subscribe to changes
		const unsubscribe = onValue(userStatusRef, handleValueChange, handleError);

		// Cleanup subscription on unmount
		return () => {
			unsubscribe();
		};
	}, [uid]);

	return { status, loading, error };
};

export default useGetUserStatus;
