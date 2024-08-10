/* eslint-disable @typescript-eslint/no-unused-vars */

import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, sendPasswordResetEmail, updateEmail, updatePassword } from 'firebase/auth';
import { createContext, ReactNode, FC, useContext, useState, useEffect } from 'react';
import { FirebaseAuth } from '../../firebase';

interface AuthenticationContextType {
    currentUser: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserEmail: (email: string) => Promise<void>;
    updateUserPassword: (password: string) => Promise<void>;
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

    const login = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(FirebaseAuth, email, password);
            setCurrentUser(userCredential.user);
        } catch (error) {
            console.error("Failed to log in", error);
        }
    };

    const signup = async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
            setCurrentUser(userCredential.user);
        } catch (error) {
            console.error("Failed to sign up", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(FirebaseAuth);
            setCurrentUser(null);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const updateUserEmail = async (email: string) =>{
        return updateEmail(currentUser as User, email)
    }

    const updateUserPassword = async (password: string) => {
        updatePassword(currentUser as User, password)
    }

    const resetPassword = async (email: string) => {
        return sendPasswordResetEmail(FirebaseAuth, email);
    }

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
