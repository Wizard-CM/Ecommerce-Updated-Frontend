import React from "react";
import Loader from "./Loader";

const PageLoader = ({height="100%"}) => {
  return (
    <div className=" w-full inset-0 flex justify-center items-center bg-black  text-gray-100 font-sans " style={{height:height}}>
      <Loader size="lg" />
    </div>
  );
};

export default PageLoader;
