"use client";

import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../app/firebase/config";
import { Toaster } from "react-hot-toast";
import { getSingleUser } from "@/Redux/API/UserApi";
import { useDispatch } from "react-redux";
import { notSetUser, setUser } from "@/Redux/Reducers/userReducer";

// Define the shape of the context value
interface AuthContextType {
  signIn: () => Promise<UserCredential>;
  logOut: () => Promise<void>;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  couponCode: string | null;
  setCouponCode: Dispatch<SetStateAction<string | null>>
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>("hero70");

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const setSidebarOpen = (isOpen: boolean) => setIsSidebarOpen(isOpen);

  useEffect(() => {
    // This function gets trigged when a user logs in or logs out from the firebase
    // If I have logged In , this onAuthStateChange will always have the user inside it ,
    // and we can get it to popule the global user state, this will run and populate the global state every time the page refreshes
    onAuthStateChanged(auth, async (user) => {
      console.log(user, "outside");
      if (user) {
        console.log(user, "inside");
        const data = await getSingleUser(user.uid);
        console.log(data.userData,"User data from context")
        dispatch(setUser(data.userData));
      } else {
        dispatch(notSetUser());
      }
    });
  }, []);

  const signIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ signIn, logOut, isSidebarOpen, toggleSidebar, setSidebarOpen,couponCode, setCouponCode }}
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          // Default styles for all toasts
          style: {
            background: "linear-gradient(to bottom right, black, #111827)", // from-black to-gray-900
            color: "#f3f4f6", // text-gray-100
            borderRadius: "0.375rem",
            padding: "16px",
          },
          // Customize different toast types
          success: {
            iconTheme: {
              primary: "#818cf8", // light indigo color to match your button gradient
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444", // red color for errors
              secondary: "#ffffff",
            },
          },
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
