"use client";
import { useAuth } from "@/context/Context";
import React, { useState } from "react";

const Banner = () => {
  const [isBannerVisible, setBannerVisible] = useState(true);
  const {couponCode, setCouponCode } = useAuth();

  return (
    <>
      {isBannerVisible && (
        <div className="bg-gradient-to-r from-indigo-900 to-purple-950 py-3 text-center relative shadow-md text-white font-sans">
          <p className="text-sm md:text-base font-medium tracking-wide">
            🎉 Limited Time Offer: Get 20% Off Everything! Use Code:{" "}
            <span className="font-bold">{couponCode}</span>
          </p>
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Banner;
