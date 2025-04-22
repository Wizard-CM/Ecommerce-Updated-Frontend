import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  allUserFetchResponse,
  deleteFetchResponse,
  deleteGarneDetails,
  userDataStructure,
  userFetchResponse,
} from "../../types/API-Types";
import axios from "axios";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/user`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    createNewUser: builder.mutation<userFetchResponse, userDataStructure>({
      query: (userData) => ({
        url: `/new`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<deleteFetchResponse, deleteGarneDetails>({
      query: ({ deleteUserId, id }) => ({
        url: `${deleteUserId}?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query<allUserFetchResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useCreateNewUserMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApi;

export const getSingleUser = async (id: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/user/${id}`
  );
  return res.data;
};
