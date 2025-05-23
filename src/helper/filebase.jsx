// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXTWW4jMtYSgniV0ZTaHumtvy8NrwzL7c",
  authDomain: "projectchecktrungfile.firebaseapp.com",
  projectId: "projectchecktrungfile",
  storageBucket: "projectchecktrungfile.firebasestorage.app",
  messagingSenderId: "394342936959",
  appId: "1:394342936959:web:05e06f24d0b48fe0acea4a",
  measurementId: "G-TYZN3655CH",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const auth = getAuth();
