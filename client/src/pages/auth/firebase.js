import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "AIzaSyDummyKeyForLocalDevelopmentOnly12345",
  authDomain: import.meta.env.VITE_AUTH_DOMAIN || "localhost",
  projectId: import.meta.env.VITE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_SENDER_ID || "",
  appId: import.meta.env.VITE_APP_ID || "1:123456789:web:abcdef"
};

let app = null;
let auth = null;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (err) {
  console.warn("Firebase initialization warning (auth disabled in offline mode):", err.message);
}

export { auth };