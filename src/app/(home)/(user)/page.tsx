"use client";
import { useEffect, useState } from "react";

import Homepage from "@/components/Pages/Home/Homepage";
import api from "@/lib/axios";
import Banner from "@/components/Utility/Banner";
import FeaturedProducts from "@/components/Pages/Home/FeaturedProduct";
import Footer from "@/components/Utility/Footer";
import Newsletter from "@/components/Utility/Newsletter";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import rootState from "@/Redux/RootState";

export default function page() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state: rootState) => state.userSlice);

  console.log(user, "User Status");

  const router = useRouter();

  // console.log(user, "User logged In");

  const getUsers = async () => {
    try {
      setIsLoading(true);
      await api.get("/api/v1/user");
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <div className="min-h-screen ">
        {/* Promotional Banner */}
        <Homepage />
        <FeaturedProducts />
        <Footer />
      </div>
    </>
  );
}
