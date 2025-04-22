import Banner from "@/components/Utility/Banner";
import Header from "@/components/Utility/Header/Header";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Banner />
      <Header padding={true} />
      {children}
    </div>
  );
};

export default Layout;
