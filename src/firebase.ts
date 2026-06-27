import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Web app's Firebase configuration
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
export const auth = getAuth(app);
