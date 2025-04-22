"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
import { auth } from "@/app/firebase/config";
import { useCreateNewUserMutation } from "@/Redux/API/UserApi";
import rootState from "@/Redux/RootState";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import { fetchResponseError } from "@/types/General";
import { notSetUser, setUser } from "@/Redux/Reducers/userReducer";
import { userTypeSample } from "@/types/API-Types";
import Cookies from "js-cookie";

const Login = () => {
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [login] = useCreateNewUserMutation();
  const dispatch = useDispatch();
  const { user: UserData } = useSelector((state: rootState) => state.userSlice);
  const router = useRouter();

  //   Handlers
  const loginHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      const res = await login({
        username: user.displayName!,
        email: user.email!,
        photo: user.photoURL!,
        dob: "2025-04-19",
        gender: "male",
        uid: user.uid,
      });

      if ("data" in res) {
        const userSetData: userTypeSample = {
          username: res.data.userData.username,
          email: res.data.userData.email,
          photo: res.data.userData.photo,
          gender: res.data.userData.gender,
          uid: res.data.userData.uid,
          _id: res.data.userData._id,
          role: res.data.userData.role,
        };
        dispatch(setUser(userSetData));
        Cookies.set("userAuthStatus", JSON.stringify(userSetData));

        console.log(UserData);
        ToasterFunction(res, `Welcome Back ${user.displayName!}`);
        return router.push("/");
      } else {
        const err = res.error as FetchBaseQueryError;
        const message = (err.data as fetchResponseError).message;
        toast.error(message);
        dispatch(notSetUser());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Redirect Code If needed
  if (UserData?._id) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800 bg-opacity-50 p-10 rounded-xl shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Sign in to access your account
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div className="rounded-md -space-y-px">
            <div className="mb-6">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Gender
              </label>
              <select
                id="gender"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value="none">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-100 mb-2"
              >
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 rounded-lg text-gray-100 bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <p className="text-gray-300">
                Already signed in once? Continue with Google
              </p>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={loginHandler}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FcGoogle className="h-5 w-5" />
              </span>
              Sign in with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
