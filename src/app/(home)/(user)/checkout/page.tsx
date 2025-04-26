"use client";

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useNewOrdersMutation } from "@/Redux/API/OrderApi";
import rootState from "@/Redux/RootState";
import { useDeleteAllCartOfUserMutation } from "@/Redux/API/CartApi";
import { productType } from "@/types/API-Types";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import { resetCart } from "@/Redux/Reducers/cartReducer";
import { useUpdateProductDataMutation } from "@/Redux/API/ProductApi";

// Use environment variable compatible with Next.js
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PROMISE || "");

const Checkout = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  useEffect(() => {
    // Next.js doesn't use react-router, so we need to access params differently
    // This is a simplified approach. In a real app, you might use a server component
    // to get the client secret from the server side or from the searchParams
    const secret = sessionStorage.getItem("stripeSecret");

    if (secret) {
      setClientSecret(secret);
      sessionStorage.removeItem("stripeSecret");
    }

    // If no client secret, redirect to shipping
    if (!clientSecret) {
      // Small timeout to avoid redirect on first render
      const timer = setTimeout(() => {
        router.push("/shipping");
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [clientSecret, router]);

  if (!clientSecret) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Elements
        options={{
          clientSecret,
          appearance: {
            theme: "night",
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#1f2937",
              colorText: "#f9fafb",
              colorDanger: "#ef4444",
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              spacingUnit: "4px",
              borderRadius: "8px",
            },
          },
        }}
        stripe={stripePromise}
      >
        <CheckoutForm />
      </Elements>
    </div>
  );
};

const CheckoutForm = () => {
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [newOrder] = useNewOrdersMutation();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const [deleteUserCartItems] = useDeleteAllCartOfUserMutation();
  const {
    products,
    shippingInfo,
    shippingCharge,
    tax,
    total,
    subTotal,
    discount,
    quantity,
  } = useSelector((state: rootState) => state.cartSlice);
  const dispatch = useDispatch();
  // Get the cart Items
  const { products: cartProducts } = useSelector(
    (state: rootState) => state.cartSlice
  );
  const [updateProductData] = useUpdateProductDataMutation();

  // Handler
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("first");

    if (!stripe || !elements) return;
    setProcessing(true);
    const orderData = {
      shippingInfo,
      shippingCharge,
      tax,
      total,
      subTotal,
      discount,
      quantity,
      cartItems: products.map((i: productType) => i._id),
      userId: user?._id,
    };
    await newOrder(orderData);

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      toast.success("Payment Made Successfully");
      await deleteUserCartItems(user?._id!);
      dispatch(resetCart());
      const updatingProductsArr = cartProducts.map(productItem => {
        const formData = new FormData();
        formData.set("stock", JSON.stringify(productItem.stock - 1));
        return updateProductData({
          data:formData,
          productId:productItem._id,
          userId:user?._id!
        })
      })

      await Promise.all(updatingProductsArr);
      router.push("/");
    }
    setProcessing(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
      <div className="w-full lg:w-2/3">
        <div className="bg-gray-800 backdrop-blur-sm bg-opacity-90 rounded-2xl shadow-2xl p-8 border border-gray-700 transition-all duration-300 hover:shadow-indigo-500/10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center">
            <span className="relative flex mr-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-20"></span>
              <svg
                className="w-8 h-8 text-indigo-400 relative"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </span>
            Complete Your Payment
          </h1>

          <ShippingInfoSummary shippingInfo={shippingInfo} />

          <form onSubmit={submitHandler} className="space-y-6">
            <div className="p-6 bg-gray-700 bg-opacity-70 rounded-xl border border-gray-600">
              <PaymentElement className="text-white payment-element" />
            </div>
            <button
              type="submit"
              disabled={processing}
              className={`w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${
                processing ? "animate-pulse" : ""
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                "Complete Payment"
              )}
            </button>
            <div className="flex items-center justify-center text-sm text-gray-300 mt-4">
              <svg
                className="w-4 h-4 mr-2 text-indigo-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Your payment information is secure and encrypted
            </div>
          </form>
        </div>
      </div>
      <OrderSummary
        products={products}
        shippingCharge={shippingCharge}
        tax={tax}
        subTotal={subTotal}
        discount={discount}
        total={total}
      />
    </div>
  );
};

// Order Summary Component
interface OrderSummaryProps {
  products: productType[];
  shippingCharge: number;
  tax: number;
  subTotal: number;
  discount: number;
  total: number;
}

const OrderSummary = ({
  products,
  shippingCharge,
  tax,
  subTotal,
  discount,
  total,
}: OrderSummaryProps) => (
  <div className="w-full lg:w-1/3 relative">
    <div className="sticky top-8 p-6 rounded-2xl bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-2xl border border-gray-700 transition-all duration-300 hover:shadow-indigo-500/10">
      <div className="absolute -right-3 -top-3 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full font-medium">
        Order Summary
      </div>

      <h2 className="text-xl font-bold text-white mb-6 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-indigo-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
        Your Items
      </h2>

      {products.length > 0 && (
        <div className="mb-6">
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {products.map((product: productType) => (
              <div
                key={product._id}
                className="flex items-center text-gray-200 py-2 px-3 rounded-lg bg-gray-700 bg-opacity-50 border border-gray-600"
              >
                {product.photo && (
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 bg-gray-600 flex-shrink-0">
                    <Image
                      src={`${product.photo}`}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-indigo-300">
                    ${product.price?.toFixed(2)} × {product.quantity || 1}
                  </p>
                </div>
                <div className="text-right text-gray-200 font-medium">
                  ${((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 text-gray-100 divide-y divide-gray-700">
        <div className="flex justify-between py-2">
          <span className="text-gray-400">Subtotal:</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-400">Shipping:</span>
          <span>${shippingCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-gray-400">Tax:</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between py-2">
            <span className="text-green-400">Discount:</span>
            <span className="text-green-400">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-4 font-bold text-lg">
          <span>Total:</span>
          <span className="text-indigo-300">${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 bg-gray-700 bg-opacity-50 p-4 rounded-xl border border-gray-600">
        <div className="flex items-center text-gray-300 text-sm mb-2">
          <svg
            className="w-4 h-4 mr-2 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          Secure checkout
        </div>
        <div className="flex items-center text-gray-300 text-sm">
          <svg
            className="w-4 h-4 mr-2 text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Your data is protected
        </div>
      </div>
    </div>
  </div>
);

// Shipping Info Summary
// interface ShippingInfoSummaryProps {
//   shippingInfo: ShippingInfoType | null;
// }

const ShippingInfoSummary = ({ shippingInfo }: any) => {
  if (!shippingInfo) return null;

  return (
    <div className="bg-gray-700 bg-opacity-60 rounded-xl p-5 mb-6 border border-gray-600 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 -mt-10 -mr-10 rounded-full bg-indigo-500 opacity-10"></div>
      <h3 className="text-gray-100 font-medium mb-3 flex items-center">
        <svg
          className="w-5 h-5 mr-2 text-indigo-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        Shipping Details
      </h3>
      <div className="bg-gray-800 bg-opacity-60 rounded-lg p-4 text-gray-300 border-l-3 border-indigo-500">
        <p className="mb-1">{shippingInfo.address}</p>
        <p className="mb-1">
          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.pinCode}
        </p>
        <p>{shippingInfo.country}</p>
      </div>
    </div>
  );
};

// CSS for Stripe Elements and other custom styles
export const getStripeStyles = () => {
  return `
    /* Stripe Element Styles */
    .payment-element .StripeElement {
      border-radius: 10px;
      padding: 14px;
      background-color: rgba(31, 41, 55, 0.8);
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
      border: 1px solid rgba(75, 85, 99, 0.4);
    }
    
    .StripeElement--focus {
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.6);
      border-color: rgba(99, 102, 241, 0.6);
    }
    
    /* Custom scrollbar for item list */
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(55, 65, 81, 0.3);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.7);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 1);
    }
    
    /* Animations */
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.6;
      }
    }
    
    @keyframes gradientBG {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    
    /* Responsive styles */
    @media (max-width: 1023px) {
      .top-8 {
        top: 0;
      }
    }
    
    @media (max-width: 640px) {
      .StripeElement {
        padding: 12px;
      }
    }
  `;
};

// Add styles to document
export function Head() {
  return (
    <>
      <title>Checkout | Your Store</title>
      <style>{getStripeStyles()}</style>
    </>
  );
}

export default Checkout;
