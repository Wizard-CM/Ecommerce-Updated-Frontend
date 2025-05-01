"use client";
import { DynamicMonthNew } from "@/components/Admin/AdminUitlities/DynamicMonth";
import { BarChart } from "@/components/Admin/Charts/Barcharts/Barchart";
import { BarC } from "@/components/Utility/Charts/Bar";
import PieC from "@/components/Utility/Charts/Pie";
import Loader from "@/components/Utility/Loader";
import PageLoader from "@/components/Utility/PageLoader";
import {
  useBarDataQuery,
  useChartDashboardDataQuery,
} from "@/Redux/API/ChartApi";
import rootState from "@/Redux/RootState";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const dynamicMonthDataSixMonth: string[] = DynamicMonthNew({
  totalPreviousMonthsIncCurrent: 6,
});
const dynamicMonthDataTwelveMonth: string[] = DynamicMonthNew({
  totalPreviousMonthsIncCurrent: 12,
});

const page = () => {
  const router = useRouter();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { data, isError } = useChartDashboardDataQuery(user?._id);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('sixMonth');

  const { data: barData, isLoading } = useBarDataQuery(user?._id);

  const chartDataSixMonth = barData?.sixMonthBarChartData;

  useEffect(() => {
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

  const pieData = data?.chartData[5];

  if (!pieData) {
    return <PageLoader />;
  }

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
          Analytics Dashboard
        </h1>
        


        {/* Charts Row 1 */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 ">
          {/* Chart 1 */}
          <div className="w-full md:w-1/2 border  border-white/50 rounded-xl">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-purple-500/10 transform transition-all duration-300 hover:shadow-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Order Fulfillment</h3>
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
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fdb232]"></div>
                    <span className="text-sm text-gray-100">
                      Processing ({pieData?.orderStatusObject.Processing || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#41ffff]"></div>
                    <span className="text-sm text-gray-100">
                      Delivered ({pieData?.orderStatusObject.Delivered || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#673dff]"></div>
                    <span className="text-sm text-gray-100">
                      Shipped ({pieData?.orderStatusObject.Shipped || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart 2 */}
          <div className="w-full md:w-1/2 border  border-white/50 rounded-xl">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-purple-500/10 transform transition-all duration-300 hover:shadow-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">User Roles</h3>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-[250px] h-[250px] mx-auto relative mb-4">
                  <PieC
                    labels={["Admin", "Customer"]}
                    dataArr={[
                      pieData?.userRoleObject.admin,
                      pieData?.userRoleObject.users,
                    ]}
                    backgroundColor={["#8b5cf6", "#ff6200"]}
                    offset={[50]}
                    cutout="70%"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
                    <span className="text-sm text-gray-100">
                      Admin ({pieData?.userRoleObject.admin || 0})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff6200]"></div>
                    <span className="text-sm text-gray-100">
                      Customer ({pieData?.userRoleObject.users || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        

      </div>
    </div>
  );
};

export default page;
