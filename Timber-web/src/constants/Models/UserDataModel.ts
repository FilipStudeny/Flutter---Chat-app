import { DocumentData, DocumentSnapshot } from "@firebase/firestore";
import { Gender } from "../Enums/Gender";

export interface UserDataModel {
  uid?: string;
  profilePictureUrl?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  online?: boolean;
  email?: string;
  userGender?: Gender;
  dateOfBirth?: Date; // Assuming you're converting Firestore timestamps to JavaScript Date objects
  aboutMe?: string;
  phoneNumber?: string | null; // Phone number can be null
  friends?: string[]; // Assuming friends are stored as an array of user IDs
}




interface UserDocument {
  firstName?: string;
  lastName?: string;
  username: string;
  profilePictureUrl: string;
  email: string;
  aboutMe?: string;
  gender: string;
  phoneNumber?: string;
  friends: string[];
  dateOfBirth: Date | null;
}

export const fromDocument = (doc: DocumentSnapshot<DocumentData>): UserDataModel => {
  const data = doc.data();
  if (!data) {
    throw new Error("Document data is undefined");
  }
  return {
    uid: doc.id,
    firstName: data.firstName,
    lastName: data.lastName,
    username: data.username,
    profilePictureUrl: data.profilePictureUrl,
    email: data.email,
    aboutMe: data.aboutMe,
    userGender: _genderFromString(data.gender),
    phoneNumber: data.phoneNumber,
    friends: data.friends ? data.friends : [],
    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toDate() : undefined,
  };
};

export const toMap = (user: UserDataModel): UserDocument => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username as string,
    profilePictureUrl: user.profilePictureUrl as string,
    email: user.email as string,
    aboutMe: user.aboutMe,
    gender: _genderToString(user.userGender as Gender),
    phoneNumber: user.phoneNumber as string,
    friends: user.friends || [],
    dateOfBirth: user.dateOfBirth || null,
  };
};

const _genderToString = (gender: Gender): string => {
  return gender === Gender.Male ? 'Male' : 'Female';
};

const _genderFromString = (gender: string): Gender => {
  return gender === 'Male' ? Gender.Male : Gender.Female;
};

export const calculateAge = (dateOfBirth?: Date): number | undefined => {
  if (!dateOfBirth) return undefined;
  const now = new Date();
  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = now.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
};
