"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import rootState from "@/Redux/RootState";
import { useChartDashboardDataQuery } from "@/Redux/API/ChartApi";

// // Dynamically import the PieC component to avoid SSR issues
const PieC = dynamic(() => import("@/components/Utility/Charts/Pie"), {
  ssr: false,
});

const Pie = () => {
  const router = useRouter();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { data, isError } = useChartDashboardDataQuery(user?._id);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Handle responsive detection
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isError) {
      router.push("/admin/line");
    }
  }, [isError, router]);

  const pieData = data?.chartData[6];

  if (!pieData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-black to-gray-900">
        <div className="animate-pulse text-white text-xl">
          Loading charts data...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white border-b border-purple-600 pb-2 inline-block">
            Pie Charts
          </h2>
          <p className="text-sm md:text-base mt-2 text-gray-300 italic">
            Analytics for the current month
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          {/* Order Fulfillment Chart */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[250px] h-[250px] mx-auto relative mb-4">
                <PieC
                  labels={["Processing", "Delivered", "Shipped"]}
                  dataArr={[
                    pieData?.orderStatusObject.Processing,
                    pieData?.orderStatusObject.Delivered,
                    pieData?.orderStatusObject.Shipped,
                  ]}
                  backgroundColor={["#fdb232", "#41ffff", "#673dff"]}
                  offset={[40, 0, 0]}
                />
              </div>
              <h3 className="text-xl font-bold text-center text-white">
                Order Fulfillment
              </h3>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#fdb232]"></div>
                  <span className="text-sm">
                    Processing ({pieData?.orderStatusObject.Processing || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#41ffff]"></div>
                  <span className="text-sm">
                    Delivered ({pieData?.orderStatusObject.Delivered || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#673dff]"></div>
                  <span className="text-sm">
                    Shipped ({pieData?.orderStatusObject.Shipped || 0})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* User Role Chart */}
          <div className="bg-gray-800 rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-500/20">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[250px] h-[250px] mx-auto relative mb-4">
                <PieC
                  labels={["Admin", "Customer"]}
                  dataArr={[
                    pieData?.userRoleObject.admin,
                    pieData?.userRoleObject.users,
                  ]}
                  backgroundColor={["#FCBA03", "#ff6200"]}
                  offset={[50]}
                  cutout="70%"
                />
              </div>
              <h3 className="text-xl font-bold text-center text-white">
                User Roles
              </h3>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FCBA03]"></div>
                  <span className="text-sm">
                    Admin ({pieData?.userRoleObject.admin || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff6200]"></div>
                  <span className="text-sm">
                    Customer ({pieData?.userRoleObject.users || 0})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pie;
