import { doc, getDoc, DocumentSnapshot, DocumentData } from "@firebase/firestore";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";
import { UserDataModel } from "../../constants/Models/UserDataModel";

export const getUser = async (
  userId: string
): Promise<ServiceResponse<UserDataModel>> => {
  try {
    // Fetch the user's document from Firestore
    const userDoc: DocumentSnapshot<DocumentData> = await getDoc(
      doc(FirebaseFireStore, "users", userId)
    );

    // Check if the document exists
    if (!userDoc.exists()) {
      return { success: false, message: "User not found" };
    }

    // Extract the user data
    const data = userDoc.data();

    // Map the Firestore data to your UserDataModel
    const user: UserDataModel = {
      uid: userDoc.id,
      profilePictureUrl: data?.profilePictureUrl || "",
      username: data?.username || "",
      age: data?.age || 0,
      gender: data?.gender || "",
      online: data?.online || false,
      email: data?.email || "",
      userGender: data?.userGender || "",
    };

    // Return the user data wrapped in a ServiceResponse
    return { success: true, data: user };
  } catch (err) {
    // Handle any errors that occur during the process
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, message: errorMessage };
  }
};
