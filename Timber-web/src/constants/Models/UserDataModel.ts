import { Gender } from "../Enums/Gender";

export interface UserDataModel {
	uid: string;
	profilePictureUrl: string;
	username: string;
	gender: Gender;
	email: string;
	dateOfBirth?: Date;
	friends: string[];
	firstName: string;
	lastName: string;
	phoneNumber: string | null;
	aboutMe: string;
}

export const calculateAge = (dateOfBirth: Date | undefined): number | undefined => {
	if (!dateOfBirth) return undefined;
	const diff = Date.now() - dateOfBirth.getTime();
	const ageDt = new Date(diff);
	return Math.abs(ageDt.getUTCFullYear() - 1970);
};
