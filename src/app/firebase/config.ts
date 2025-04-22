import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_VITE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_VITE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_VITE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_VITE_MESSAGE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_VITE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_VITE_MEASUREMENT_ID,
};

// Initializing Firebase App
export const app = initializeApp(firebaseConfig);
// Initializing the Authentication Service of Firebase App
export const auth = getAuth(app);
