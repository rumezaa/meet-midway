import { auth, db, signInWithEmailAndPassword } from "./Firebase";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { collection, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";

async function addUser(data) {
  const usersCollection = collection(db, "users");

  try {
    const userRef = doc(usersCollection, auth.currentUser.uid);
    await setDoc(userRef, data);
    await updateDoc(userRef, { id: userRef.id });
    console.log("Document successfully written!");
  } catch (e) {
    console.error("Error writing document: ", e);
  }
}

// Function to verify email and password input
const verifyInputs = ({ email, password, error, setError }) => {
  if (!email || !password) {
    setError("Please fill in both email and password.");
    setTimeout(() => {
      setError(""); // Reset after 5 seconds
    }, 3000);
    return false;
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  if (!emailPattern.test(email)) {
    setError("Please enter a valid email address.");
    setTimeout(() => {
      setError(""); // Reset after 5 seconds
    }, 3000);
    return false;
  }

  setError(""); // Clear any previous error messages
  console.log("verified");
  return true;
};

// Sign in function for manual email and password entry
export const signIn = ({ email, password, setAnimate, error, setError }) => {
  if (!verifyInputs({ email, password, error, setError })) {
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Signed in success:", user);
    })
    // in case of error
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Sign in error:", errorCode, errorMessage);
    });
};

export const signInWithGoogle = async ({setError}) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Signed in with Google:", user);

    // Check if user exists in Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      // If user doesn't exist, create a new user document
      const data = {
        first_name: user.displayName.split(" ")[0], // Assuming displayName is in "First Last" format
        last_name: user.displayName.split(" ").slice(1).join(" "), // All parts after the first part
        email: user.email,
        location: "", // Add default location or prompt user to update later
        preferences: [],
        signInFirstTime: true,
      };

      addUser(data);
      console.log("New user document created in Firestore:", data);
    }
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    setError("Error signing in with Google");
    setTimeout(() => {
      setError(""); // Reset after 5 seconds
    }, 3000);
  }
};

export function checkFields({
  email,
  firstName,
  lastName,
  location,
  password,
}) {
  return (
    (password &&
      email?.length > 0 &&
      firstName?.length > 0 &&
      lastName?.length > 0 &&
      location &&
      !!location &&
      password?.length > 0) ||
    (email?.length > 0 &&
      firstName?.length > 0 &&
      lastName?.length > 0 &&
      location &&
      !!location)
  );
}

export function signUp({
  email,
  password,
  firstName,
  lastName,
  location,
  error,
  setError,
}) {
  if (checkFields({ email, password, firstName, lastName, location })) {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const data = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          location: location,
          signInFirstTime: true,
          preferences: [],
        };
        addUser(data);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
  } else {
    setError(true);
  }
}
