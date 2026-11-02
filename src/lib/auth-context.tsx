import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleAuthProvider } from './firebase.ts';
import { Institution, UserProfile } from '../types/index.ts';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  institution: Institution | null;
  token: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshInstitution: () => Promise<void>;
  setInstitution: React.Dispatch<React.SetStateAction<Institution | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  institution: null,
  token: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  refreshInstitution: async () => {},
  setInstitution: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync user with backend
  const syncWithBackend = async (idToken: string) => {
    try {
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setInstitution(data.institution);
      }
    } catch (err) {
      console.error('Failed to sync auth with backend:', err);
    }
  };

  const loadDefaultInstitution = async () => {
    try {
      const res = await fetch('/api/institution');
      if (res.ok) {
        const data = await res.json();
        setInstitution(data);
      }
    } catch (err) {
      console.error('Failed to fetch default institution:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);
          await syncWithBackend(idToken);
        } catch (e) {
          console.error('Error fetching token:', e);
        }
      } else {
        setToken(null);
        setProfile(null);
        await loadDefaultInstitution();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      await syncWithBackend(idToken);
    } catch (error: any) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setProfile(null);
      setToken(null);
      await loadDefaultInstitution();
    } catch (error) {
      console.error('Sign Out failed:', error);
    }
  };

  const refreshInstitution = async () => {
    await loadDefaultInstitution();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        institution,
        token,
        loading,
        signInWithGoogle,
        signOut,
        refreshInstitution,
        setInstitution,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
