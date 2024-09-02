import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { useState, useEffect } from "react";

export interface FileMetadata {
	url: string;
	type: string;
	size: number;
	name: string;
}

interface UseGetUserPhotosProps {
	userId: string;
	autoFetch?: boolean;
}

interface UseGetUserPhotos {
	loading: boolean;
	error: string | null;
	photos: FileMetadata[];
	fetchPhotos: () => Promise<void>;
	reset: () => void;
}

const useGetUserPhotos = ({ userId, autoFetch = true }: UseGetUserPhotosProps): UseGetUserPhotos => {
	const [photos, setPhotos] = useState<FileMetadata[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPhotos = async () => {
		if (!userId) {
			setError("User ID is required to fetch photos.");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const directoryName = `users/${userId}_photos`;
			const storage = getStorage();
			const storageRef = ref(storage, directoryName);

			const result = await listAll(storageRef);
			const photoMetadata: FileMetadata[] = await Promise.all(
				result.items.map(async (itemRef) => {
					const url = await getDownloadURL(itemRef);
					const metadata = await getMetadata(itemRef);
					const fileType = metadata.contentType ?? "application/octet-stream";
					const fileSize = metadata.size ?? 0;

					return {
						url,
						type: fileType,
						size: fileSize,
						name: itemRef.name,
					};
				}),
			);

			setPhotos(photoMetadata);
		} catch (err) {
			setError(err instanceof Error ? err.message : "An unknown error occurred while fetching photos.");
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setPhotos([]);
		setError(null);
		setLoading(false);
	};

	// Automatically fetch photos if autoFetch is true and userId changes
	useEffect(() => {
		if (autoFetch && userId) {
			fetchPhotos();
		}
	}, [userId, autoFetch]);

	return {
		loading,
		error,
		photos,
		fetchPhotos,
		reset,
	};
};

export default useGetUserPhotos;
