import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	User,
	sendPasswordResetEmail,
	updateEmail,
	updatePassword,
} from "firebase/auth";
import { getDatabase, ref, set, onDisconnect, remove } from "firebase/database";
import { createContext, ReactNode, FC, useContext, useState, useEffect, useMemo } from "react";

import getFirabaseAuthErrorMessage from "../../constants/Errors/firebase-auth-errors";
import { UserDataModel } from "../../constants/Models/UserDataModel";
import { FirebaseAuth } from "../../firebase";
import createUser from "../../services/DatabaseService/createUser";
import getUser from "../../services/DatabaseService/getUser";
import { uploadFile } from "../../services/FileStorageService/uploadFile";

interface AuthResponse {
	success: boolean;
	message?: string;
	user?: User;
}

interface AuthenticationContextType {
	currentUser: User | null;
	login: (email: string, password: string) => Promise<AuthResponse>;
	signup: (newUser: UserDataModel, password: string, file: File | null) => Promise<AuthResponse>;
	logout: () => Promise<AuthResponse>;
	resetPassword: (email: string) => Promise<AuthResponse>;
	updateUserEmail: (email: string) => Promise<AuthResponse>;
	updateUserPassword: (password: string) => Promise<AuthResponse>;
	userData: UserDataModel | null;
	setUserData: React.Dispatch<React.SetStateAction<UserDataModel | null>>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

interface AuthenticationProviderProps {
	children: ReactNode;
}

export const useAuth = (): AuthenticationContextType => {
	const context = useContext(AuthenticationContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthenticationProvider");
	}
	return context;
};

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserDataModel | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const database = getDatabase();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(FirebaseAuth, async (user) => {
			setCurrentUser(user);
			setIsLoading(false);

			if (user) {
				const userStatusRef = ref(database, `/status/${user.uid}`);
				const userResponse = await getUser(user.uid);
				if (userResponse.success && userResponse.data) {
					setUserData(userResponse.data);

					set(userStatusRef, {
						online: true,
						last_seen: Date.now(),
					});

					onDisconnect(userStatusRef).set({
						online: false,
						last_seen: Date.now(),
					});
				}
			}
		});

		return () => unsubscribe();
	}, [database]);

	const login = async (email: string, password: string): Promise<AuthResponse> => {
		try {
			const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
			setCurrentUser(userCredential.user);

			const userStatusRef = ref(database, `/status/${userCredential.user.uid}`);
			set(userStatusRef, {
				online: true,
				last_seen: Date.now(),
			});

			const userResponse = await getUser(userCredential.user.uid);
			if (userResponse.success && userResponse.data) {
				setUserData(userResponse.data);
			}

			return { success: true, user: userCredential.user };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	const signup = async (newUser: UserDataModel, password: string, file: File | null): Promise<AuthResponse> => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				FirebaseAuth,
				newUser.email as string,
				password,
			);
			setCurrentUser(userCredential.user);

			const userStatusRef = ref(database, `/status/${userCredential.user.uid}`);
			set(userStatusRef, {
				online: true,
				last_seen: Date.now(),
			});

			const photoUpload = await uploadFile(
				file,
				`users/${userCredential.user.uid}_photos`,
				Date.now().toString(),
			);
			if (!photoUpload.success) {
				return { success: false, message: "Couldn't upload photo, try again." };
			}

			newUser.profilePictureUrl = photoUpload.data?.url || "";
			newUser.uid = userCredential.user.uid;
			const userCreation = await createUser(newUser.uid, newUser);
			if (!userCreation.success) {
				return { success: false, message: "Couldn't create user, try again." };
			}

			return { success: true, user: userCredential.user };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	const logout = async (): Promise<AuthResponse> => {
		try {
			if (currentUser) {
				const userStatusRef = ref(database, `/status/${currentUser.uid}`);
				await remove(userStatusRef);
			}

			await signOut(FirebaseAuth);
			setCurrentUser(null);

			return { success: true };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	const updateUserEmail = async (email: string): Promise<AuthResponse> => {
		try {
			await updateEmail(currentUser as User, email);
			return { success: true };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	const updateUserPassword = async (password: string): Promise<AuthResponse> => {
		try {
			await updatePassword(currentUser as User, password);
			return { success: true };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	const resetPassword = async (email: string): Promise<AuthResponse> => {
		try {
			await sendPasswordResetEmail(FirebaseAuth, email);
			return { success: true };
		} catch (error) {
			const firebaseError = error as { code: string };
			return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
		}
	};

	// Memoize the context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			currentUser,
			login,
			signup,
			logout,
			resetPassword,
			updateUserPassword,
			updateUserEmail,
			userData,
			setUserData,
		}),
		[currentUser, userData], // Dependencies for useMemo
	);

	return <AuthenticationContext.Provider value={value}>{!isLoading && children}</AuthenticationContext.Provider>;
};

export default AuthenticationContext;
