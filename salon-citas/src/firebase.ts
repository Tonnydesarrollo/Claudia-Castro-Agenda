// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBR3G8j0KgmwaxAIcX4vT8_Dzj7mXeowk",
  authDomain: "agenda-unas.firebaseapp.com",
  projectId: "agenda-unas",
  storageBucket: "agenda-unas.appspot.com",
  messagingSenderId: "321015434491",
  appId:    "1:321015434491:web:TU_APP_ID_REAL",
  measurementId: "G-XXXXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Forzar selector de cuenta
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const db = getFirestore(app);
