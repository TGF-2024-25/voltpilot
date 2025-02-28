// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "voltpilot.firebaseapp.com",
  projectId: "voltpilot",
  storageBucket: "voltpilot.firebasestorage.app",
  messagingSenderId: "391380693258",
  appId: "1:391380693258:web:d4b974d0d8fc9e2addcaf3",
  measurementId: "G-S687YZ2Y7F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Opcional: Exporta servicios específicos si los necesitas
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
