import React from "react";
import Loader from "./Loader";

const PageLoader = () => {
  return (
    <div className="absolute z-0 left-0 top-0 min-h-screen w-full inset-0 flex justify-center items-center bg-black  text-gray-100 font-sans ">
      <Loader size="lg" />
    </div>
  );
};

export default PageLoader;
