import { useState } from "react";

import {
	deleteFile,
	deleteMultipleFiles as deleteFilesFromStorage,
} from "../../services/FileStorageService/deleteFile";

interface UseDeleteFiles {
	loading: boolean;
	error: string | null;
	success: boolean;
	deleteSingleFile: (fileUrl: string) => Promise<void>;
	deleteMultipleFiles: (fileUrls: string[]) => Promise<void>;
}

const useDeleteFiles = (): UseDeleteFiles => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	const deleteSingleFile = async (fileUrl: string) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const response = await deleteFile(fileUrl);

			if (response.success) {
				setSuccess(true);
			} else {
				setError(response.message || "Error deleting file.");
			}
		} catch (err) {
			setError("An error occurred while deleting the file.");
		} finally {
			setLoading(false);
		}
	};

	const deleteMultipleFiles = async (fileUrls: string[]) => {
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const results = await deleteFilesFromStorage(fileUrls);

			const failedDeletions = results.filter((result) => !result.success);

			if (failedDeletions.length === 0) {
				setSuccess(true);
			} else {
				setError("Some files failed to delete.");
			}
		} catch (err) {
			setError("An error occurred while deleting files.");
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		deleteSingleFile,
		deleteMultipleFiles,
	};
};

export default useDeleteFiles;
