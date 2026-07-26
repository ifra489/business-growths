import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { UserProfile } from '../types';
import { saveUserProfile, getUserProfile } from '../services/firebaseService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser || null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const ensurePersistence = async () => {
    try {
      await setPersistence(auth, browserLocalPersistence);
    } catch (error) {
      console.warn('Unable to set Firebase auth persistence:', error);
    }
  };

  useEffect(() => {
    const configurePersistence = async () => {
      await ensurePersistence();
    };

    configurePersistence();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          const fallbackProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Business Owner',
            photoURL: user.photoURL || null,
            createdAt: new Date().toISOString(),
          };
          setUserProfile((prev) => prev || fallbackProfile);
          setLoading(false);

          try {
            const profile = await getUserProfile(user.uid);
            if (profile) {
              setUserProfile(profile);
            } else {
              await saveUserProfile(fallbackProfile);
            }
          } catch (profileErr) {
            console.warn('Non-blocking profile load warning:', profileErr);
          }
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during auth state change:', error);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      await ensurePersistence();
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setCurrentUser(res.user);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: res.user.displayName || email.split('@')[0],
        photoURL: res.user.photoURL || null,
        createdAt: new Date().toISOString(),
      };
      setUserProfile(profile);
      saveUserProfile(profile).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    try {
      await ensurePersistence();
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: name,
        photoURL: null,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(res.user);
      setUserProfile(profile);
      saveUserProfile(profile).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await ensurePersistence();
      const res = await signInWithPopup(auth, googleProvider);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Google User',
        photoURL: res.user.photoURL || null,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(res.user);
      setUserProfile(profile);
      saveUserProfile(profile).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
