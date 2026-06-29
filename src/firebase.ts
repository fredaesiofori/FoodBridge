import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's real Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJnVoAXdFXnrl_YgcOsDfIexKT-OGNefU",
  authDomain: "foodbridge-6457d.firebaseapp.com",
  projectId: "foodbridge-6457d",
  storageBucket: "foodbridge-6457d.firebasestorage.app",
  messagingSenderId: "782751679546",
  appId: "1:782751679546:web:54922fdcecbcb5d527e103"
};

// Initialize Firebase safely
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("Firestore offline persistence fallback:", err.code);
  });
}
export const auth = getAuth(app);

// Configure Google OAuth Provider with correct provider ID ('google.com') and scopes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

