import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";

export interface FileMetadata {
  url: string;
  type: string;
  size: number;
  name: string;
}

export const uploadFile = async (
  file: File | null,
  directory: string,
  fileName: string
): Promise<ServiceResponse<FileMetadata>> => {
  try {
    if (!file) {
      return {
        data: { url: '', type: '', size: 0, name: '' },
        success: false,
        message: "No file provided.",
      };
    }

    const storage = getStorage();
    const storageRef = ref(storage, `${directory}/${fileName}`);

    // Upload the file to Firebase Storage
    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);
    const fileType = file.type || 'application/octet-stream';

    const fileMetadata: FileMetadata = {
      url: fileUrl,
      type: fileType,
      size: file.size,
      name: fileName,
    };

    return { success: true, data: fileMetadata };
  } catch (err) {
    return {
      data: { url: '', type: '', size: 0, name: '' },
      success: false,
      message: err instanceof Error ? err.message : "An unknown error occurred",
    };
  }
};
