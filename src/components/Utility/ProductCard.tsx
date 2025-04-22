import { productType } from "@/types/API-Types";
import { useState } from "react";

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

interface productProps {
  img: string;
  name: string;
  price: number;
  cartHandler: (product: productType) => void;
  product: productType;
}

const ProductCard = ({
  img,
  price,
  name,
  cartHandler,
  product,
}: productProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className="relative group overflow-hidden rounded-xl transition-all duration-500 shadow-lg hover:shadow-2xl bg-gradient-to-br from-black to-gray-900 p-5 border border-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
      
      {/* Top decorative SVG */}
      <svg
        className="absolute top-3 left-3 w-6 h-6 text-indigo-500"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3L21 3M3 3L3 21M3 3L11 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-lg mb-4 shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
          src={`${img}`}
          alt={name}
          className="object-cover h-full w-full transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Price tag */}
        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg z-20 transform transition-transform duration-500 group-hover:translate-y-1">
          <span className="text-white font-bold">₹{price}</span>
        </div>
      </div>

      {/* Product info */}
      <div className="px-1 pb-3 relative">
        <div className="flex items-center mb-1">
          <div className="h-1 w-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mr-2"></div>
          <span className="text-gray-300 font-medium text-sm uppercase tracking-wider">{product.category || 'Product'}</span>
        </div>
        <h3 className="text-white font-bold text-lg line-clamp-1">{capitalizeFirstLetter(name)}</h3>
        
        {/* Animated underline on hover */}
        <div className="h-0.5 w-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-1 transition-all duration-500 group-hover:w-1/2"></div>
      </div>

      {/* Add to cart button */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-end px-5">
        <button
          onClick={() => cartHandler(product)}
          className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-lg shadow-lg transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 hover:shadow-indigo-500/40 flex items-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L5.2 15H17M9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18C8.32843 18 9 18.6716 9 19.5ZM17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5C14 18.6716 14.6716 18 15.5 18C16.3284 18 17 18.6716 17 19.5Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          Add to cart
        </button>
      </div>
      
      {/* Bottom decorative SVG */}
      <svg
        className="absolute bottom-3 right-3 w-6 h-6 text-purple-600/40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          className={`transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          fill="currentColor"
          fillOpacity="0.3"
        />
      </svg>
      
      {/* Animated corner accent */}
      <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rotate-45 transform transition-transform duration-500 group-hover:scale-150"></div>
    </div>
  );
};

export default ProductCard;