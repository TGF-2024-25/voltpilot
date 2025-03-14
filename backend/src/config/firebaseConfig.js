// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5KwMKbqlIIr-ULDX-25jj46nrjCvLC6w",
  authDomain: "voltpilot-410ae.firebaseapp.com",
  projectId: "voltpilot-410ae",
  storageBucket: "voltpilot-410ae.firebasestorage.app",
  messagingSenderId: "289966534205",
  appId: "1:289966534205:web:1bd447adcec0b4163c0454",
  measurementId: "G-KQ00BYXQ3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Opcional: Exporta servicios específicos si los necesitas
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
