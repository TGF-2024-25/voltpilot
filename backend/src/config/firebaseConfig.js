// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBoE8BZGMWDD5oX5oBcvdVu-Sr9CFonpGg",
    authDomain: "voltpilot-c6e44.firebaseapp.com",
    projectId: "voltpilot-c6e44",
    storageBucket: "voltpilot-c6e44.firebasestorage.app",
    messagingSenderId: "888970558314",
    appId: "1:888970558314:web:ef0b04b434f1a3a0e5c313",
    measurementId: "G-S2S4EGWJHW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Opcional: Exporta servicios específicos si los necesitas
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };