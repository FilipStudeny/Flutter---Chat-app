/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    User,
    sendPasswordResetEmail,
    updateEmail,
    updatePassword
} from 'firebase/auth';
import { createContext, ReactNode, FC, useContext, useState, useEffect } from 'react';
import { FirebaseAuth } from '../../firebase';
import { getFirabaseAuthErrorMessage } from '../../constants/Errors/firebase-auth-errors';

interface AuthResponse {
    success: boolean;
    message?: string;
    user?: User;
}

interface AuthenticationContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<AuthResponse>;
    signup: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<AuthResponse>;
    resetPassword: (email: string) => Promise<AuthResponse>;
    updateUserEmail: (email: string) => Promise<AuthResponse>;
    updateUserPassword: (password: string) => Promise<AuthResponse>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

interface AuthenticationProviderProps {
    children: ReactNode;
}

export const useAuth = () => {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthenticationProvider');
    }
    return context;
};

export const AuthenticationProvider: FC<AuthenticationProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
            setCurrentUser(userCredential.user);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const firebaseError = error as { code: string };
            return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
        }
    };

    const signup = async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
            setCurrentUser(userCredential.user);
            return { success: true, user: userCredential.user };
        } catch (error) {
            const firebaseError = error as { code: string };
            return { success: false, message: getFirabaseAuthErrorMessage(firebaseError.code) };
        }
    };

    const logout = async (): Promise<AuthResponse> => {
        try {
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
            console.error("Failed to update password", error);
            return { success: false, message: (error as Error).message };
        }
    };

    const resetPassword = async (email: string): Promise<AuthResponse> => {
        try {
            await sendPasswordResetEmail(FirebaseAuth, email);
            return { success: true };
        } catch (error) {
            console.error("Failed to reset password", error);
            return { success: false, message: (error as Error).message };
        }
    };

    const value: AuthenticationContextType = {
        currentUser,
        login,
        signup,
        logout,
        resetPassword,
        updateUserPassword,
        updateUserEmail
    };

    return (
        <AuthenticationContext.Provider value={value}>
            {!isLoading && children}
        </AuthenticationContext.Provider>
    );
};

export default AuthenticationContext;

