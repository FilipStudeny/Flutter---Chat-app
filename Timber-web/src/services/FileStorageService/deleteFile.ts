import { getStorage, ref, deleteObject } from "firebase/storage";

import getFirebaseStorageErrorMessage from "../../constants/Errors/firebase-storage-errors";

async function deleteFile(fileUrl: string): Promise<{ success: boolean; message?: string }> {
	try {
		const storage = getStorage();
		const storageRef = ref(storage, fileUrl);
		await deleteObject(storageRef);

		return { success: true };
	} catch (error: any) {
		const errorMessage = getFirebaseStorageErrorMessage(error.code);
		return { success: false, message: errorMessage };
	}
}

async function deleteMultipleFiles(fileUrls: string[]): Promise<{ success: boolean; message?: string }[]> {
	return Promise.all(fileUrls.map((fileUrl) => deleteFile(fileUrl)));
}

export { deleteFile, deleteMultipleFiles };
