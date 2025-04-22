import React from "react";
import Loader from "./Loader";

interface FetchLoaderProps {
  className?: string;
  text?: string;
}

const FetchLoader: React.FC<FetchLoaderProps> = ({ className = "", text }) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Loader size="sm" showText={text !== undefined} className="inline-flex" />
      {text && <span className="ml-2 text-gray-400 text-sm">{text}</span>}
    </div>
  );
};

export default FetchLoader;
