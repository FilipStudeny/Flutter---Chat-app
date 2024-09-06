import { useState, useEffect } from "react";

import getUserPhotos, { FileMetadata } from "../../services/FileStorageService/getUserPhotos";

interface UseGetUserPhotosProps {
	userId: string;
}

interface UseGetUserPhotos {
	loading: boolean;
	error: string | null;
	photos: FileMetadata[] | null;
	fetchPhotos: () => Promise<void>;
}

const useGetUserPhotos = ({ userId }: UseGetUserPhotosProps): UseGetUserPhotos => {
	const [photos, setPhotos] = useState<FileMetadata[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPhotos = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getUserPhotos(userId);

			if (response.success && response.data) {
				setPhotos(response.data);
			} else {
				setError(response.message || "Error fetching user photos.");
			}
		} catch (err) {
			setError("An error occurred while fetching user photos.");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (userId) {
			fetchPhotos();
		}
	}, [userId]);

	return {
		loading,
		error,
		photos,
		fetchPhotos,
	};
};

export default useGetUserPhotos;
