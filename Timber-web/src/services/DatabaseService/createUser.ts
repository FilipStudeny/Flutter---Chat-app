import { doc, setDoc, Timestamp } from "firebase/firestore";
import { FirebaseFireStore } from "../../firebase";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { calculateAge, UserDataModel } from "../../constants/Models/UserDataModel";

export const createUser = async (
  id: string,
  user: UserDataModel
): Promise<ServiceResponse<boolean>> => {
  try {
    // Assuming the calculateAge method exists on UserProfile
    user.age = calculateAge(user.dateOfBirth) as number;

    await setDoc(doc(FirebaseFireStore, "users", id), {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePictureUrl: user.profilePictureUrl,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      friends: user.friends,
      aboutMe: user.aboutMe,
      dateOfBirth: user.dateOfBirth ? Timestamp.fromDate(user.dateOfBirth) : null,
    });

    return { success: true, data: true };
  } catch (err) {
    return { success: false, data: false, message: err instanceof Error ? err.message : "An unknown error occurred" };
  }
};
