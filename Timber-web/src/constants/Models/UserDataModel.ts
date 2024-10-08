import { Gender } from "../Enums/Gender";

export interface UserDataModel {
	uid?: string;
	profilePictureUrl?: string;
	username?: string;
	gender?: Gender | null;
	email?: string;
	dateOfBirth?: Date;
	friends?: string[];
	firstName?: string;
	lastName?: string;
	phoneNumber?: string | null;
	aboutMe?: string;
}

export const calculateAge = (dateOfBirth: Date | undefined): number | undefined => {
	if (!dateOfBirth) return undefined;
	const diff = Date.now() - dateOfBirth.getTime();
	const ageDt = new Date(diff);
	return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export const genderToString = (gender: Gender): string => gender.toLowerCase();

export const getFullName = (user: UserDataModel): string => {
	const { firstName, lastName } = user;
	if (firstName && lastName) {
		return `${firstName} ${lastName}`;
	}
	if (firstName) {
		return firstName;
	}
	if (lastName) {
		return lastName;
	}
	return "";
};
