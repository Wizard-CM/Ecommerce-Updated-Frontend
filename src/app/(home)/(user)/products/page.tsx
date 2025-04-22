"use client";
import Loader from "@/components/Utility/Loader";
import PageLoader from "@/components/Utility/PageLoader";
import ProductCard from "@/components/Utility/ProductCard";
import { mockProducts } from "@/data/tempProductData";
import { useAddToCartBackendMutation } from "@/Redux/API/CartApi";
import {
  useAllCategoriesQuery,
  useSortedProductsQuery,
} from "@/Redux/API/ProductApi";
import { addToCart } from "@/Redux/Reducers/cartReducer";
import rootState from "@/Redux/RootState";
import { productType } from "@/types/API-Types";
import { fetchResponseError } from "@/types/General";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const [range, setRange] = useState<number>(20000);
  const [sort, setSort] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  const dispatch = useDispatch();
  const [addToCartBackend] = useAddToCartBackendMutation();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { products } = useSelector((state: rootState) => state.cartSlice);

  const { data, isLoading, isError, error } = useSortedProductsQuery({
    price: range,
    sort,
    category,
    search,
    page,
  });

  if (isError) {
    const err = error as fetchResponseError;
    toast.error(err.message);
  }

  // Getting and adding quantity property
  const { data: categoryData, isError: categoryError } =
    useAllCategoriesQuery(null);

  // const modifiedData = mockProducts.map((i: productType) => ({
  //   ...i,
  //   quantity: 0,
  // }));
  const modifiedData = data?.productData.map((i: productType) => ({
    ...i,
    quantity: 0,
  }));

  if (categoryError) {
    const err = error as fetchResponseError;
    toast.error(err.message);
  }

  // Pagination Related Data
  let arr = [];
  for (let i = 0; i < data?.totalPages!; i++) {
    arr.push(i + 1);
  }

  // Handlers
  const addToCartHanlder = async (product: productType) => {
    dispatch(addToCart(product));
    const cartAddedProduct = products.find(
      (i: productType) => i._id === product._id
    );

    if (cartAddedProduct?.quantity! >= cartAddedProduct?.stock!) {
      return;
    }

    const res = await addToCartBackend({
      productId: product._id,
      userId: user?._id!,
    });

    if ("data" in res) {
      toast.success(`Data Successfully Added To The Cart`);
    } else {
      const err = res.error as FetchBaseQueryError;
      const error = (err.data as fetchResponseError).message;
      toast.error(`${error}`);
    }
  };

  return (
    <div className="min-h-screen max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Section */}
        <div className="lg:w-1/4 w-full">
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-xl shadow-xl p-6 border border-gray-800/40 backdrop-blur-sm">
            <h3 className="text-white text-xl font-bold mb-6 border-b border-gray-700 pb-3 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              FILTERS
            </h3>
            <form className="space-y-8">
              {/* Sort Filter */}
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  Sort
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    onChange={(e) => {
                      setSort(e.target.value);
                    }}
                  >
                    <option value={"undefined"}>None</option>
                    <option value="des">Price (High To Low)</option>
                    <option value="asc">Price (Low To High)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Price Range
                </label>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">₹100</span>
                  <span className="text-gray-400">₹100,000</span>
                </div>
                <p className="text-indigo-400 text-sm font-medium flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Current: ₹{range.toLocaleString()}
                </p>
                <input
                  type="range"
                  min={100}
                  max={100000}
                  value={range}
                  onChange={(e) => {
                    setRange(+e.target.value);
                  }}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="bg-gray-800/50 px-3 py-2 rounded-md text-sm text-indigo-300 border border-indigo-900/40">
                  Drag slider to set your maximum price
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Category
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                  >
                    <option value={"undefined"}>All Categories</option>
                    {categoryData?.productData.map((cat: string, i) => (
                      <option value={cat} key={i}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <button
                type="button"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:w-3/4 w-full">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4">
              <div className="flex items-center mb-4 sm:mb-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h2 className="text-white text-2xl font-bold">PRODUCTS</h2>
                <div className="ml-3 px-3 py-1 bg-indigo-900/40 rounded-full text-indigo-300 text-xs font-medium">
                  {modifiedData?.length || 0} items
                </div>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search Products..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  className="w-full bg-gray-800/80 text-white border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {isLoading ? (
              <div className="py-10 flex justify-center">
                <PageLoader />
              </div>
            ) : (
              <>
                {modifiedData && modifiedData.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modifiedData?.map((product) => (
                      <ProductCard
                        key={product._id}
                        cartHandler={addToCartHanlder}
                        name={product.name}
                        price={product.price}
                        img={product.photo}
                        product={product}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-600 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-1">
                      No Products Found
                    </h3>
                    <p className="text-gray-400 max-w-md">
                      Try adjusting your filters or search criteria to find what
                      you're looking for.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {data?.totalPages! > 1 && (
              <div className="mt-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 bg-gray-900/50 p-4 rounded-lg border border-gray-800/40">
                <div className="flex items-center space-x-2 text-gray-300">
                  <span>Page:</span>
                  <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 px-3 py-1 rounded-md text-white font-bold">
                    {page + 1}
                  </div>
                  <span>of</span>
                  <div className="bg-gray-800 px-3 py-1 rounded-md text-white font-bold">
                    {data?.totalPages}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-2 rounded-lg font-medium ${
                      page === 0
                        ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      if (page > 0) setPage((prev) => prev - 1);
                    }}
                    disabled={page === 0}
                  >
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
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {arr.map((i, index) => {
                    if (i > 3) {
                      return null;
                    }
                    return (
                      <button
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                          page === i - 1
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                        onClick={() => {
                          setPage(i - 1);
                        }}
                      >
                        {i}
                      </button>
                    );
                  })}

                  {arr.length > 3 && (
                    <span className="text-gray-500 px-1">...</span>
                  )}

                  {data?.totalPages! > 3 && (
                    <button
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 flex items-center"
                      onClick={() => {
                        if (page < data?.totalPages! - 1) {
                          setPage((prev) => prev + 1);
                        }
                      }}
                    >
                      Next
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
