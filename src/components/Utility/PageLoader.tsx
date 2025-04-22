import React from "react";
import Loader from "./Loader";

const PageLoader = () => {
  return (
    <div className="h-full w-full inset-0 flex justify-center items-center bg-black  text-gray-100 font-sans ">
      <Loader size="lg" />
    </div>
  );
};

export default PageLoader;
