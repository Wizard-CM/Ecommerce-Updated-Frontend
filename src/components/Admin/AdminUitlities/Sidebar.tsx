"use client";
import React, { useEffect, useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { FaTimes } from "react-icons/fa";
import { FiPieChart, FiBarChart2, FiTrendingUp } from "react-icons/fi";
import { MdDashboard, MdInventory } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import Link from "next/link";
import { usePathname } from "next/navigation";

type LiProps = {
  onClickHandler: (value: React.SetStateAction<boolean>) => void;
  url: string;
  text: string;
  icon: React.ReactNode;
};

const LiComponent = ({ onClickHandler, url, text, icon }: LiProps) => {
  const pathname = usePathname();
  const isActive = pathname === url;

  return (
    <li className="mb-3 relative group">
      {isActive && (
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-10 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-lg"></div>
      )}
      <Link
        href={url}
        onClick={() => {
          onClickHandler(false);
        }}
        className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-600/80 hover:to-purple-600/80 hover:shadow-lg hover:shadow-indigo-600/20 ${
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-700/30"
            : "text-gray-100 hover:text-white"
        }`}
      >
        <div
          className={`text-xl ${
            isActive ? "text-white" : "text-indigo-400 group-hover:text-white"
          }`}
        >
          {icon}
        </div>
        <span className={`${isActive ? "font-medium" : ""} transition-all`}>
          {text}
        </span>

        {isActive && (
          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white"></div>
        )}
      </Link>
    </li>
  );
};

const AdminSideBar = () => {
  const [screenSize, setScreenSize] = useState(
    typeof window !== "undefined" ? window.screen.availWidth : 1200
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.screen.availWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {screenSize < 1000 && !isOpen && (
        <button
          id="hamburger"
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          aria-label="Open Menu"
        >
          <HiMenuAlt4 className="text-xl" />
        </button>
      )}

      <div
        className={`bg-gradient-to-br from-black to-gray-900 text-gray-100 h-full w-full border-r  border-r-white/50 transition-all duration-500 shadow-2xl relative overflow-hidden ${
          isOpen || screenSize >= 1000 ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/4"></div>

        <div className="relative z-10">
          {/* Dashboard Section */}
          <div className="p-5 mt-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 px-3 flex items-center">
              <span className="mr-2 w-1 h-4 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full inline-block"></span>
              Dashboard
            </h3>
            <ul className="space-y-1">
              <LiComponent
                onClickHandler={setIsOpen}
                url="/admin/dashboard"
                text="Dashboard"
                icon={<MdDashboard />}
              />
              <LiComponent
                onClickHandler={setIsOpen}
                url="/admin/products"
                text="Products"
                icon={<MdInventory />}
              />
              <LiComponent
                onClickHandler={setIsOpen}
                url="/admin/customers"
                text="Customers"
                icon={<FaUsers />}
              />
              <LiComponent
                onClickHandler={setIsOpen}
                url="/admin/transactions"
                text="Transactions"
                icon={<GrTransaction />}
              />
            </ul>
          </div>

          {/* Charts Section */}
          <div className="p-5 mt-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 px-3 flex items-center">
              <span className="mr-2 w-1 h-4 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-full inline-block"></span>
              Charts
            </h3>
            <ul>
              <LiComponent
                onClickHandler={setIsOpen}
                url="/admin/charts"
                text="Charts"
                icon={<FiPieChart />}
              />
            </ul>
          </div>

          {/* Mobile Close Button */}
          {screenSize < 1000 && (
            <div className="p-5 absolute bottom-6 w-full">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-700/30 transition-all duration-300 border border-white/10"
              >
                <FaTimes /> Close Menu
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSideBar;
