import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration (Supports dynamic environment overrides)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBJnVoAXdFXnrl_YgcOsDfIexKT-OGNefU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "foodbridge-6457d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "foodbridge-6457d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "foodbridge-6457d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "782751679546",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:782751679546:web:54922fdcecbcb5d527e103"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);
