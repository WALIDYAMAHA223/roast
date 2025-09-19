// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIV1kNlxcMytp6W02ZCSbVHaKoWG4-D5g",
  authDomain: "roast-ea643.firebaseapp.com",
  projectId: "roast-ea643",
  storageBucket: "roast-ea643.firebasestorage.app",
  messagingSenderId: "181926460268",
  appId: "1:181926460268:web:c70553d325da4ff256d149",
  measurementId: "G-HSYG5T5104"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, analytics };
