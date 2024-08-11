import { DocumentData, DocumentSnapshot } from "@firebase/firestore";
import { Gender } from "../Enums/Gender";

export interface UserDataModel {
  id?: string;
  firstName?: string;
  lastName?: string;
  username: string;
  profilePictureUrl: string;
  email: string;
  aboutMe?: string;
  userGender: Gender;
  phoneNumber?: string;
  friends?: string[];
  dateOfBirth?: Date;
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
    id: doc.id,
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
    username: user.username,
    profilePictureUrl: user.profilePictureUrl,
    email: user.email,
    aboutMe: user.aboutMe,
    gender: _genderToString(user.userGender),
    phoneNumber: user.phoneNumber,
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
