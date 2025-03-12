// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhGSq7gHY48j77mF5CsUJ_gyErUkZr-3w",
  authDomain: "rashawesa-66348.firebaseapp.com",
  projectId: "rashawesa-66348",
  storageBucket: "rashawesa-66348.firebasestorage.app",
  messagingSenderId: "712553793394",
  appId: "1:712553793394:web:e861aefdf75e80f0e37feb",
  measurementId: "G-3QQGZ6Z9ZS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore instance
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
