import { auth } from "@/app/firebase/config";
import { signOut } from "firebase/auth";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function UserDropdown({
  account = false,
}: {
  account?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user } = useSelector((state: any) => state.userSlice);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // Handler
  const logoutHandler = () => {

    signOut(auth)
      .then(() => {
        toast.success("Signed Out Successfully");
        Cookies.set("userAuthStatus", "null");
        router.push("/signin");
      })
      .catch((error) => {
        console.log(error);
        toast.success("Failed Signing Out");
      });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative " ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={toggleDropdown}
        className="transition-all duration-200 cursor-pointer flex gap-3"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="border rounded-full p-1 border-indigo-700 text-gray-400 hover:text-indigo-300 hover:border-indigo-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </span>

        {account && "Account"}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-3 w-48 rounded-md shadow-lg z-20 transform transition ease-out duration-200">
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-lg ring-1 ring-indigo-700 ring-opacity-40 shadow-xl overflow-hidden">
            {user?.role == "admin" && (
              <div
                className="cursor-pointer w-full text-left px-4 py-2 text-gray-100 hover:bg-gray-800 transition-colors duration-150 flex items-center gap-2 "
                onClick={() => {
                  return router.push("/admin/dashboard");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Admin
              </div>
            )}

            {user?.role == "admin" && (
              <div className="border-t border-gray-700 my-1"></div>
            )}

            <div
              className="w-full cursor-pointer text-left px-4 py-2 text-gray-100 hover:bg-gray-800 transition-colors duration-150 flex items-center gap-2"
              onClick={logoutHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign out
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
