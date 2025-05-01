"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import {
  updateCartItem,
  useAddToCartBackendMutation,
  useDeleteFromCartMutation,
} from "@/Redux/API/CartApi";
import rootState from "@/Redux/RootState";
import {
  addToCart,
  decrementHandler,
  removeCartItem,
  setAmount,
  setCartItems,
} from "@/Redux/Reducers/cartReducer";
import { productType } from "@/types/API-Types";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import Link from "next/link";
import { useAuth } from "@/context/Context";

const Cart = () => {
  const dispatch = useDispatch();
  const [addToCartBackend] = useAddToCartBackendMutation();
  const [deleteFromCartBackend] = useDeleteFromCartMutation();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { products } = useSelector((state: rootState) => state.cartSlice);

  // Coupon code state
  const [inputCouponCode, setInputCouponCode] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponMessage, setCouponMessage] = useState<string>("");

  // Get coupon code from global context
  const { couponCode } = useAuth();

  // Handlers

  // Decrement Handler
  const decrementHandlerFunction = async (id: string) => {
    dispatch(decrementHandler(id));
    const product = products.find((i: productType) => i._id === id);

    if (product?.quantity! <= 1) {
      return;
    }

    // Changes should be reflected to the database as well
    const res = await updateCartItem({ userId: user?._id, productId: id });
    ToasterFunction(res, "Cart Successfully Updated");
  };

  // Increment Handler
  const addToCartHanlder = async (product: productType) => {
    dispatch(addToCart(product));

    const cartAddedProduct = products.find(
      (i: productType) => i._id === product._id
    );

    // if (cartAddedProduct?.quantity! >= cartAddedProduct?.stock!) {
    //   return;
    // }

    console.log(user?._id,"User's IDDDD")

    const res = await addToCartBackend({
      productId: product._id,
      userId: user?._id!,
    });
    ToasterFunction(res, "Cart Item Successfully Incremented");
  };

  // Remove Handler
  const cartItemRemoveHandler = async (id: string) => {
    dispatch(removeCartItem(id));
    const res = await deleteFromCartBackend({
      userId: user?._id,
      productId: id,
    });
    ToasterFunction(res, "Cart Item Successfully Removed");
  };

  // Apply Coupon Code Handler
  const applyCouponCode = () => {
    if (inputCouponCode === couponCode) {
      // Generate random discount percentage between 1-50%
      const randomDiscount = Math.floor(Math.random() * 50) + 1;
      setDiscountPercentage(randomDiscount);
      setCouponApplied(true);
      setCouponMessage(`${randomDiscount}% discount applied!`);

    } else {
      setCouponApplied(false);
      setDiscountPercentage(0);
      setCouponMessage("Invalid coupon code");
    }
  };

  useEffect(() => {
    const res = axios.get(
      `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/cart/${user?._id}`
    );
    res.then(({ data }) => {
      const cartItemsData = data.cartItemData.map((i: any) => {
        return { ...i.product, quantity: i.quantity };
      });
      dispatch(setCartItems(cartItemsData));
    });
  }, []);

  // Cart Items Pricing Details
  const subTotal = products?.reduce((acc, curr) => {
    return (acc += curr.quantity! * curr.price);
  }, 0);
  const shippingCharge = subTotal < 10000 ? 0 : 100;
  const tax = Math.round((subTotal + shippingCharge) * 0.13);

  // Calculate discount amount based on percentage
  const discount = couponApplied
    ? Math.round((subTotal * discountPercentage) / 100)
    : 0;

  const total = subTotal + shippingCharge + tax - discount;
  const orderQuantity = products.reduce(
    (acc, curr) => (acc += curr.quantity!),
    0
  );

  useEffect(() => {
    if (total) {
      dispatch(
        setAmount({
          total,
          subTotal,
          shippingCharge,
          tax,
          discount,
          quantity: orderQuantity,
        })
      );
    }
  }, [total, subTotal, orderQuantity, discount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1450px] mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FaShoppingCart className="text-3xl mr-3" />
          <h1 className="text-3xl font-extrabold">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gray-800 bg-opacity-50 rounded-xl overflow-hidden shadow-2xl p-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                <FaShoppingCart className="text-5xl mb-4 text-gray-500" />
                <h2 className="text-2xl font-bold text-gray-400">
                  Your cart is empty
                </h2>
                <p className="mt-2 text-gray-500">Add items to get started</p>
                <Link
                  href="/"
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {products.map((i) => (
                  <div
                    key={i._id}
                    className="flex flex-col sm:flex-row items-center p-4 hover:bg-gray-800 transition duration-200"
                  >
                    <div className="flex flex-1 items-center mb-4 sm:mb-0">
                      <div className="w-20 h-20 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={`${i.photo}`}
                          alt={i.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold text-lg">
                          {i?.name?.toLocaleUpperCase()}
                        </h4>
                        <span className="text-xl font-bold text-indigo-400">
                          ₹{i?.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => decrementHandlerFunction(i?._id)}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="w-10 text-center font-semibold">
                        {i?.quantity}
                      </span>
                      <button
                        className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors cursor-pointer"
                        onClick={() => addToCartHanlder(i)}
                      >
                        <FaPlus className="text-xs" />
                      </button>
                      <button
                        className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors ml-2 cursor-pointer"
                        onClick={() => cartItemRemoveHandler(i?._id)}
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-xl shadow-2xl p-6 h-fit">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-4">
              Order Summary
            </h2>

            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <span className="font-medium">₹{subTotal}</span>
              </div>

              <div className="flex justify-between">
                <p>Shipping</p>
                <span className="font-medium">₹{shippingCharge}</span>
              </div>

              <div className="flex justify-between">
                <p>Tax</p>
                <span className="font-medium">₹{tax}</span>
              </div>

              <div className="flex justify-between">
                <p>Discount</p>
                <span className="text-red-400 font-medium">-₹{discount}</span>
              </div>

              <div className="border-t border-gray-700 pt-3 mt-4">
                <div className="flex justify-between font-bold text-xl">
                  <p>Total</p>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative mb-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={inputCouponCode}
                    onChange={(e) => setInputCouponCode(e.target.value)}
                  />
                  <button
                    onClick={applyCouponCode}
                    className="ml-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <div
                    className={`mt-2 text-sm ${
                      couponApplied ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {couponMessage}
                  </div>
                )}
                {couponApplied && (
                  <div className="mt-2 text-green-400 font-medium">
                    Discount applied: ₹{discount} ({discountPercentage}% off)
                  </div>
                )}
              </div>

              {products.length >= 1 && (
                <Link
                  href="/shipping"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center shadow-lg hover:from-indigo-700 hover:to-purple-700 transition duration-300"
                >
                  Proceed to Checkout
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
