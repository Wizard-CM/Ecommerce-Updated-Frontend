"use client";
import Sidebar from "@/components/Admin/AdminUitlities/Sidebar";
import Header from "@/components/Utility/Header/Header";
import { useAuth } from "@/context/Context";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isSidebarOpen } = useAuth();
  const [screenSize, setScreenSize] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-row min-h-screen">
        {/* Sidebar */}
        <div
          className={
            screenSize < 1000 ? "fixed z-50 h-full" : "w-[20%] lg:w-[15%]"
          }
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div
          className={`transition-all duration-300 ${
            screenSize < 1000 ? "w-full px-4" : "w-[80%] lg:w-[85%] ml-auto"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
