import { collection, DocumentData, QuerySnapshot } from "@firebase/firestore";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";
import { getDocs } from "firebase/firestore";

export interface UserDataModel {
  uid: string;
  profilePictureUrl: string;
  username: string;
  age: number;
  gender: string;
  online: boolean; 
  email: string;
  userGender: string;
}

export const getAllUsers = async (): Promise<ServiceResponse<UserDataModel[]>> => {
  try {
    const usersCollection = collection(FirebaseFireStore, "users");
    const userSnapshot: QuerySnapshot<DocumentData> = await getDocs(usersCollection);

    const users: UserDataModel[] = userSnapshot.docs.map(doc => {
      const data = doc.data();

      return {
        uid: doc.id, 
        profilePictureUrl: data.profilePictureUrl,
        username: data.username,
        age: data.age,
        gender: data.gender,
        online: false, 
        email: data.email,
        userGender: data.userGender,
      } as UserDataModel;
    });

    return { success: true, data: users };
  } catch (error) {
    const firetSoreError = error as { code: string };
    console.error("Error fetching users:", firetSoreError);
    return { success: false, message: firetSoreError.code };
  }
};
