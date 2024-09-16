import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";

import { FileMetadata } from "../../constants/Models/FileMetadata";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";

const getUserPhotos = async (userId: string): Promise<ServiceResponse<FileMetadata[]>> => {
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

		return { data: photoMetadata, success: true };
	} catch (err) {
		return {
			data: [],
			success: false,
			message: err instanceof Error ? err.message : String(err),
		};
	}
};

export default getUserPhotos;
