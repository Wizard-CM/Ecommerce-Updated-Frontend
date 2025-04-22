import Sidebar from "@/components/Admin/AdminUitlities/Sidebar";
import Header from "@/components/Utility/Header/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <Header width="100%" padding={true} />
      <div className="w-full flex justify-between min-h-screen">
        <div className="w-[30%] lg:w-[15%]">
          <Sidebar />
        </div>
        <div className="w-[70%] lg:w-[85%] ">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
