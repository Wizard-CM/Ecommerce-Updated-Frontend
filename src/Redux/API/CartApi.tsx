import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  cartFetchResponse,
  cartSchemaDataProps,
  details,
} from "../../types/API-Types";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/cart`,
  }),
  endpoints: (builder) => ({
    addToCartBackend: builder.mutation<cartFetchResponse, cartSchemaDataProps>({
      query: (cartData) => ({
        url: `/new`,
        method: "POST",
        body: cartData,
      }),
    }),
    deleteFromCart: builder.mutation({
      query: (details: details) => ({
        url: `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/cart/${details.userId}/${details.productId}?id=${details.userId}`,
        method: "DELETE",
      }),
    }),
    deleteAllCartOfUser: builder.mutation({
      query: (id: string) => ({
        url: `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/cart/${id}?id=${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddToCartBackendMutation,
  useDeleteFromCartMutation,
  useDeleteAllCartOfUserMutation,
} = cartApi;

export const updateCartItem = async (details: details) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/${details.userId}/${details.productId}?id=${details.userId}`
  );
  return res;
};
