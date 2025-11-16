/**
 * Firebase Configuration and Services
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import Constants from 'expo-constants';

// Firebase configuration
// TODO: Replace with your actual Firebase config
// Get these values from Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'your-api-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-auth-domain',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-storage-bucket',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'your-messaging-sender-id',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 'your-app-id',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;
let analytics: Analytics | null = null;

// Check if Firebase config is valid (not placeholder values)
const isFirebaseConfigured = 
  firebaseConfig.apiKey !== 'your-api-key' &&
  firebaseConfig.projectId !== 'your-project-id';

if (isFirebaseConfigured) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      // Initialize Analytics only on web (and only if config is valid)
      if (Constants.platform?.web && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (analyticsError) {
          console.warn('Firebase Analytics initialization failed:', analyticsError);
          analytics = null;
        }
      }
    } else {
      app = getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      if (Constants.platform?.web && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (analyticsError) {
          console.warn('Firebase Analytics initialization failed:', analyticsError);
          analytics = null;
        }
      }
    }
  } catch (error) {
    console.warn('Firebase initialization error:', error);
    console.warn('App will continue without Firebase features. Please configure Firebase for full functionality.');
    // Don't throw - let the app continue without Firebase
  }
} else {
  console.warn('Firebase not configured. App will run without Firebase features.');
  console.warn('To enable Firebase, add your config to environment variables.');
}

export { app, auth, db, storage, analytics };
export default app;

