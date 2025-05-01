
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYQ2lcegLK4Fsd-Rmh6Cibn4hDDyJzSj0",
  authDomain: "fitflow-4bc64.firebaseapp.com",
  projectId: "fitflow-4bc64",
  storageBucket: "fitflow-4bc64.appspot.com",
  messagingSenderId: "1068869216685",
  appId: "1:1068869216685:web:219d701ed4bfb6d622d924",
  measurementId: "G-2R9M6WFZ0H"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Firestore Collections
export const usersCol = collection(db, "users");
export const getUserDoc = (uid) => doc(db, "users", uid);
