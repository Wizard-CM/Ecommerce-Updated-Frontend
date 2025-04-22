"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiArrowLeft,
  FiMapPin,
  FiHome,
  FiMap,
  FiFlag,
  FiHash,
} from "react-icons/fi";
import rootState from "@/Redux/RootState";
import { setShippingInformation } from "@/Redux/Reducers/cartReducer";
import FetchLoader from "@/components/Utility/FetchLoader";

// Type definitions
interface ShippingInfoProps {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: number;
}

// Assuming this function is defined in your Redux slice

// Default shipping info
const defaultShippingInfo = {
  address: "Samakhusi",
  city: "Kathmandu",
  state: "Kathmandu",
  country: "Nepal",
  pinCode: 20834,
};

const Shipping = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [shippingInfo, setShippingInfo] =
    useState<ShippingInfoProps>(defaultShippingInfo);
  const { products, total } = useSelector(
    (state: rootState) => state.cartSlice
  );
  const [isLoading, setIsLoading] = useState(false);

  // Handler for form submission
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(setShippingInformation(shippingInfo));

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      sessionStorage.setItem('stripeSecret', data.stripe_Secret);
      return router.push("/checkout");
    } catch (error) {
      console.error("Payment creation failed:", error);
      setIsLoading(false);
    }
  };

  // Handler for input changes
  const changeHandler = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  // Redirect if cart is empty
//   if (products.length <= 0) {
//     router.push("/cart");
//     return null;
//   }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.push("/cart")}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            <span>Back to Cart</span>
          </button>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-xl">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-center text-white mb-6">
              Shipping Information
            </h1>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-4">
                {/* Address Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Address"
                    name="address"
                    defaultValue={shippingInfo.address}
                    onChange={changeHandler}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* City Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHome className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="City"
                    name="city"
                    defaultValue={shippingInfo.city}
                    onChange={changeHandler}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* State Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMap className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="State"
                    name="state"
                    defaultValue={shippingInfo.state}
                    onChange={changeHandler}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                {/* Country Selection */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiFlag className="text-gray-400" />
                  </div>
                  <select
                    name="country"
                    required
                    defaultValue={shippingInfo.country}
                    onChange={changeHandler}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-gray-100 appearance-none"
                  >
                    <option value="">Choose Country</option>
                    <option value="Nepal">Nepal</option>
                    <option value="India">India</option>
                    <option value="China">China</option>
                    <option value="Japan">Japan</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Pin Code Field */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiHash className="text-gray-400" />
                  </div>
                  <input
                    required
                    type="number"
                    placeholder="Pin Code"
                    name="pinCode"
                    defaultValue={shippingInfo.pinCode}
                    onChange={changeHandler}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 p-4 bg-gray-900 bg-opacity-60 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Items</span>
                  <span>{products.length}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span className="text-indigo-400">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300"
              >
                {isLoading ? (
                  <FetchLoader text="Processing..." />
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-sm text-center text-gray-400">
          <p>
            Your information is secure and will only be used for shipping
            purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
