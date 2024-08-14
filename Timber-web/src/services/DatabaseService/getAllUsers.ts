import { collection, DocumentData, Query, QuerySnapshot, query, where, startAfter, limit } from "@firebase/firestore";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";
import { getDocs, DocumentSnapshot } from "firebase/firestore";
import { UserDataModel } from "../../constants/Models/UserDataModel";

export const getAllUsers = async ({ 
  limit: resultLimit = 10, 
  lastDocument, 
  excludeId 
}: { 
  limit?: number; 
  lastDocument?: DocumentSnapshot<DocumentData>; 
  excludeId?: string; 
} = {}): Promise<ServiceResponse<UserDataModel[]>> => { // Updated to return UserProfile[]
  try {
    const usersCollection = collection(FirebaseFireStore, "users");

    let userQuery: Query<DocumentData> = query(
      usersCollection,
      excludeId ? where("__name__", "!=", excludeId) : where("__name__", ">=", ""), // use ">=" if no excludeId
      limit(resultLimit)
    );

    if (lastDocument) {
      userQuery = query(userQuery, startAfter(lastDocument));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const users: UserDataModel[] = querySnapshot.docs.map(doc => {
        const data = doc.data();

        return {
          aboutMe: data.aboutMe || "", // Ensure default values if data is missing
          age: data.age || 0, // Default age to 0 if not present
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth.seconds * 1000) : new Date(), // Convert Firestore timestamp to Date
          email: data.email || "",
          firstName: data.firstName || "",
          friends: data.friends || [], // Ensure friends is an array
          gender: data.gender || "Other", // Default to "Other" if not present
          lastName: data.lastName || "",
          phoneNumber: data.phoneNumber || null, // Allow null for phoneNumber
          profilePictureUrl: data.profilePictureUrl || "",
          username: data.username || "",
        } as UserDataModel;
      });

      return { success: true, data: users };
    } else {
      return { success: false, message: "No users found" };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, message: errorMessage };
  }
};
