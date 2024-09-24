// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAckcmGGmaYNg1reikA7furgzeY7_uSmwM",
  authDomain: "bowled-lol.firebaseapp.com",
  projectId: "bowled-lol",
  storageBucket: "bowled-lol.appspot.com",
  messagingSenderId: "859137109390",
  appId: "1:859137109390:web:946f55f45e95d5fd5108df"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export { auth, onAuthStateChanged, googleProvider };