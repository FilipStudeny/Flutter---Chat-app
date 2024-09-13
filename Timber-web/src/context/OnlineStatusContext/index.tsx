import { onAuthStateChanged, User } from "firebase/auth";
import { ref, set, onDisconnect, getDatabase } from "firebase/database";
import { createContext, ReactNode, FC, useContext, useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { FirebaseAuth } from "../../firebase";

interface UserStatusContextType {
	currentUser: User | null;
	currentPage: string;
	updateUserStatus: () => Promise<void>;
}

const UserStatusContext = createContext<UserStatusContextType | null>(null);

interface UserStatusProviderProps {
	children: ReactNode;
}

export const useUserStatus = (): UserStatusContextType => {
	const context = useContext(UserStatusContext);
	if (!context) {
		throw new Error("useUserStatus must be used within a UserStatusProvider");
	}
	return context;
};

export const UserStatusProvider: FC<UserStatusProviderProps> = ({ children }) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const location = useLocation();
	const database = getDatabase();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(FirebaseAuth, async (user) => {
			setCurrentUser(user);
			setIsLoading(false);

			if (user) {
				const userStatusRef = ref(database, `/status/${user.uid}`);

				set(userStatusRef, {
					online: true,
					last_seen: Date.now(),
					current_page: location.pathname,
				});

				onDisconnect(userStatusRef).set({
					online: false,
					last_seen: Date.now(),
					current_page: location.pathname,
				});
			}
		});

		return () => unsubscribe();
	}, [database, location.pathname]);

    

	const updateUserStatus = async (): Promise<void> => {
		if (!currentUser) return;
		const userStatusRef = ref(database, `/status/${currentUser.uid}`);

		await set(userStatusRef, {
			online: true,
			last_seen: Date.now(),
			current_page: location.pathname,
		});
	};

	const value = useMemo(
		() => ({
			currentUser,
			currentPage: location.pathname,
			updateUserStatus,
		}),
		[currentUser, location.pathname],
	);

	return <UserStatusContext.Provider value={value}>{!isLoading && children}</UserStatusContext.Provider>;
};
