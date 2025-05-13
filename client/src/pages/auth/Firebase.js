// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNziADEr44z-bE-Do0Wbq1AYqLyCR660o",
  authDomain: "e-commerce-47277.firebaseapp.com",
  projectId: "e-commerce-47277",
  storageBucket: "e-commerce-47277.appspot.com",
  messagingSenderId: "679330501220",
  appId: "1:679330501220:web:e29751824657d89ca8c571",
  measurementId: "G-5K6CC8TGTS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }