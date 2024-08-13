import { collection, DocumentData, Query, QuerySnapshot, query, where, startAfter, limit, getDoc, doc } from "@firebase/firestore";
import { ServiceResponse } from "../../constants/Models/ServiceResponse";
import { FirebaseFireStore } from "../../firebase";
import { getDocs, DocumentSnapshot } from "firebase/firestore";

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

export const getAllFriends = async ({ 
  limit: resultLimit = 10, 
  lastDocument, 
  userId 
}: { 
  limit?: number; 
  lastDocument?: DocumentSnapshot<DocumentData>; 
  userId?: string; 
} = {}): Promise<ServiceResponse<UserDataModel[]>> => {
  try {
    const userDoc = await getDoc(doc(FirebaseFireStore, "users", userId!));

    if (!userDoc.exists()) {
      return { success: false, message: "User not found" };
    }

    const friends = userDoc.data()?.friends as string[] || [];

    if (friends.length === 0) {
      return { success: true, message: "No friends found", data: [] };
    }

    let friendQuery: Query<DocumentData> = query(
      collection(FirebaseFireStore, "users"),
      where("__name__", "in", friends),
      limit(resultLimit)
    );

    if (lastDocument) {
      friendQuery = query(friendQuery, startAfter(lastDocument));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(friendQuery);

    if (!querySnapshot.empty) {
      const friendUsers: UserDataModel[] = querySnapshot.docs.map(doc => {
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

      return { success: true, data: friendUsers };
    } else {
      return { success: false, message: "No friends found" };
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
    return { success: false, message: errorMessage };
  }
};
