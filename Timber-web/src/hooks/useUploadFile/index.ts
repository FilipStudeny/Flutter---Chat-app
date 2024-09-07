import { useState } from "react";

import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FileMetadata, uploadFile } from "../../services/FileStorageService/uploadFile";

interface UseUploadFile {
	loading: boolean;
	error: string | null;
	success: boolean | null;
	fileMetadata: FileMetadata | null;
	uploadUserFile: (file: File | null, directory: string, fileName: string) => Promise<string | null>;
}

const useUploadFile = (): UseUploadFile => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean | null>(null);
	const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);

	const uploadUserFile = async (file: File | null, directory: string, fileName: string): Promise<string | null> => {
		setLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const response: ServiceResponse<FileMetadata> = await uploadFile(file, directory, fileName);

			if (response.success && response.data) {
				setFileMetadata(response.data);
				setSuccess(true);
				return response.data.url;
			}
			setError(response.message || "Error uploading file.");
			return null;
		} catch (err) {
			setError("An error occurred while uploading the file.");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		success,
		fileMetadata,
		uploadUserFile,
	};
};

export default useUploadFile;
