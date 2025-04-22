"use client";

import TableHOC from "@/components/Admin/AdminUitlities/TableHOC";
import Loader from "@/components/Utility/Loader";
import PageLoader from "@/components/Utility/PageLoader";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "@/Redux/API/UserApi";
import rootState from "@/Redux/RootState";
import { fetchResponseError } from "@/types/General";
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";

type customerDataType = {
  avatar: ReactElement;
  name: string;
  gender: string;
  email: string;
  role: ReactElement | string; // Updated to allow ReactElement for styled role
  action: ReactElement;
};

const columns: Column<customerDataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: rootState) => state.userSlice);
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery(user?._id!);
  const [allUsers, setAllUsers] = useState<customerDataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();

  if (isError) {
    const err = error as fetchResponseError;
    toast.error(err.message);
  }

  const deleteHanlder = async (id: string) => {
    const res = await deleteUser({
      deleteUserId: id,
      id: user?._id!,
    });
    ToasterFunction(res, "User Successfully Deleted");
  };

  useEffect(() => {
    if (userData?.userData) {
      const mondifiedData = userData.userData.map((i) => {
        return {
          avatar: (
            <div className="flex justify-center items-center">
              {i.photo ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                  <img
                    src={i.photo}
                    alt={i.username}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = "/default-avatar.png"; // Fallback image path
                    }}
                  />
                </div>
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}
            </div>
          ),
          name: i.username,
          gender: i.gender,
          email: i.email,
          role: (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                i.role === "admin"
                  ? "bg-purple-900 text-purple-200"
                  : "bg-indigo-900 text-indigo-200"
              }`}
            >
              {i.role}
            </span>
          ),
          action: (
            <button
              onClick={() => {
                deleteHanlder(i._id);
              }}
              className="p-2 rounded-full bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              aria-label="Delete user"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          ),
        };
      });
      setAllUsers(mondifiedData);
    }
  }, [userData]);

  const JSX = TableHOC(columns, allUsers, true)();

  return (
    <div className="outlet w-full">
      <div className="customer-section bg-gradient-to-br from-black to-gray-900 min-h-screen text-gray-100 p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Customers
            </h1>
            <div className="text-sm text-gray-400">
              <span className="font-semibold">{allUsers.length}</span> total
              users
            </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border  border-white/50">
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <PageLoader />
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">{JSX}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
