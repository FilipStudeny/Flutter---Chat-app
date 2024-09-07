import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import updateProfilePicture from "../../services/DatabaseService/updateProfilePicture";

interface UseUpdateProfilePicture {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	updatePicture: (id: string, profilePictureUrl: string) => Promise<void>;
}

const useUpdateProfilePicture = (): UseUpdateProfilePicture => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	const updatePicture = async (id: string, profilePictureUrl: string) => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response: ServiceResponse<boolean> = await updateProfilePicture(id, profilePictureUrl);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error updating profile picture.");
			}
		} catch (err) {
			setError("An error occurred while updating the profile picture.");
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		updatePicture,
	};
};

export default useUpdateProfilePicture;
