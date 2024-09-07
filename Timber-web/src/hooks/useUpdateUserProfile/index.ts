import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import updateProfile from "../../services/DatabaseService/updateProfile";

interface UseUpdateUserProfile {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	updateUserProfile: (id: string, user: UserDataModel) => Promise<void>;
}

const useUpdateUserProfile = (): UseUpdateUserProfile => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);

	const updateUserProfile = async (id: string, user: UserDataModel) => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response: ServiceResponse<boolean> = await updateProfile(id, user);
			console.log(response);
			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error updating profile.");
			}
		} catch (err) {
			setError("An error occurred while updating the profile.");
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		updateUserProfile,
	};
};

export default useUpdateUserProfile;
