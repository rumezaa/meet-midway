
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration 
const firebaseConfig = {
    apiKey: "AIzaSyBiMM-ZrnqBIfVaEYg3gbq3IbI3xLDLIRk",
    authDomain: "meetmidway-11c52.firebaseapp.com",
    projectId: "meetmidway-11c52",
    storageBucket: "meetmidway-11c52.appspot.com",
    messagingSenderId: "183536709536",
    appId: "1:183536709536:web:04f38e856528a41f3efec5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup };