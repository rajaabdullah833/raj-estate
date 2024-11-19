// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "my-project-be18b.firebaseapp.com",
  projectId: "my-project-be18b",
  storageBucket: "my-project-be18b.appspot.com",
  messagingSenderId: "490782414455",
  appId: "1:490782414455:web:baa9d8394f7f5445eb1872"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);