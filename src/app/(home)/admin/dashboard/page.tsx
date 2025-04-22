"use client";

import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
import { BiMaleFemale } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import rootState from "@/Redux/RootState";
import { useChartDashboardDataQuery } from "@/Redux/API/ChartApi";
import Loader from "@/components/Utility/Loader";
import { BarChart } from "@/components/Admin/Charts/Barcharts/Barchart";
import PageLoader from "@/components/Utility/PageLoader";
import { TrendingUp, TrendingDown, Circle } from "lucide-react";
import WidgetComponent from "@/components/Admin/AdminUitlities/WidgetComponent";
import InventoryPanel from "@/components/Admin/AdminUitlities/DashboardCategories";

const userImg =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJxA5cTf-5dh5Eusm0puHbvAhOrCRPtckzjA&usqp";

const Dashboard = () => {
  const router = useRouter();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { data, isLoading, isError } = useChartDashboardDataQuery(
    "67f0a7204a3273aa44c30200"
  );
  // const { data, isLoading, isError } = useChartDashboardDataQuery(user?._id);

  // Chart Data
  const topWidgetData = data?.chartData[1];
  const topWidgetPercentage = data?.chartData[0];
  const categoryData = data?.chartData[2];
  const categoryArray = categoryData ? Object.keys(categoryData) : null;
  const sixMonthRevenueArray = data?.chartData[4]?.sixMonthRevenueArray;
  const sixMonthTransactionArray = data?.chartData[4]?.sixMonthTransactionArray;
  const genderRatio = data?.chartData[3];
  const latestTransactionData = data?.chartData[5];

  useEffect(() => {
    if (isError) {
      router.push("/");
    }
  }, [isError, router]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="w-full bg-gradient-to-br from-black to-gray-900 min-h-screen text-gray-100 p-4 md:p-6 lg:p-8">
      {/* Widgets Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <WidgetComponent
          title={"Revenue"}
          value={topWidgetData?.revenue}
          amount={true}
          percentage={topWidgetPercentage?.revenuePercentage}
          color={"#6366F1"} // Indigo color that matches our theme
        />
        <WidgetComponent
          title={"Users"}
          value={topWidgetData?.users}
          percentage={topWidgetPercentage?.userPercentage}
          color={"#8B5CF6"} // Purple color that matches our theme
        />
        <WidgetComponent
          title={"Transactions"}
          value={topWidgetData?.transactions}
          percentage={topWidgetPercentage?.transactionPercentage}
          color={"#EC4899"} // Pink color
        />
        <WidgetComponent
          title={"Products"}
          value={topWidgetData?.products}
          percentage={topWidgetPercentage?.productPercentage}
          color={"#10B981"} // Green color
        />
      </div>

      {/* Charts Section */}
      {/* Main container with responsive padding */}
      <div className="w-full  ">
        {/* Main content wrapper */}
        <div className="flex justify-between gap-2 w-full">
          {/* Revenue Chart Section - Full width on mobile */}
          <div className="w-[72%] bg-gradient-to-br from-black to-gray-900  rounded-2xl shadow-2xl border  border-white/50">
            <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-xl overflow-hidden border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
              <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-indigo-500/30">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold py-3 sm:py-5 text-center text-white flex justify-center items-center gap-2">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                  <span className="hidden xs:inline">
                    Revenue and Transactions
                  </span>
                  <span className="xs:hidden">Revenue</span>
                </h2>
              </div>
              <div className="p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="bg-gray-900/50 p-2 sm:p-4 rounded-lg">
                  {/* Chart container with responsive height */}
                  <div className="">
                    <BarChart
                      data1={sixMonthRevenueArray}
                      data2={sixMonthTransactionArray}
                      label1="Revenue"
                      label2="Transactions"
                      backgroundColor1="rgba(236, 72, 153, 0.8)"
                      backgroundColor2="rgba(99, 102, 241, 0.8)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Panel - Use your existing component */}
          <div className="w-[27%]">
            <InventoryPanel
              categoryArray={categoryArray}
              categoryData={categoryData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

type categoryComponentProps = {
  title: string;
  color: string;
  percentage: number;
};

const CategoryComponent = ({
  title,
  color,
  percentage,
}: categoryComponentProps) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="font-medium truncate flex-1">{title}</span>
      <div className="relative w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          style={{
            backgroundColor: color,
            width: `${percentage}%`,
            height: "100%",
          }}
          className="absolute left-0 top-0 rounded-full"
        ></div>
      </div>
      <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
    </div>
  );
};
