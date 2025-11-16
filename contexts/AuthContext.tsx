/**
 * AuthContext
 * Authentication context with Firebase Auth integration and persistence
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { signIn, register, resetPassword } from '@/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@smart_river_watch_auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setUser(firebaseUser);
          // Store auth state in AsyncStorage
          await AsyncStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
            })
          );
        } else {
          // User is signed out
          setUser(null);
          // Clear auth state from AsyncStorage
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Error handling auth state:', error);
      } finally {
        setLoading(false);
        if (initializing) {
          setInitializing(false);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [initializing]);

  // Restore auth state from AsyncStorage on mount
  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          // Auth state will be set by onAuthStateChanged listener
          // This just ensures we have the data available immediately
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      }
    };

    restoreAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await signIn(email, password);
      // User state will be updated by onAuthStateChanged listener
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const registerUser = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await register(email, password);
      // User state will be updated by onAuthStateChanged listener
    } catch (error: any) {
      setLoading(false);
      throw error;
    }
  };

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      // Clear AsyncStorage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register: registerUser,
    forgotPassword,
    logout,
  };

  // Show loading screen while initializing
  if (initializing) {
    return null; // Or return a loading component
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

