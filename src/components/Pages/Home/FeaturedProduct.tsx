import Loader from "@/components/Utility/Loader";
import ProductCard from "@/components/Utility/ProductCard";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import { useAddToCartBackendMutation } from "@/Redux/API/CartApi";
import { addToCart } from "@/Redux/Reducers/cartReducer";
import rootState from "@/Redux/RootState";
import { productType } from "@/types/API-Types";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingBag, Sparkles } from "lucide-react";

const FeaturedProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [addToCartBackend] = useAddToCartBackendMutation();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { products } = useSelector((state: rootState) => state.cartSlice);

  // Handlers
  const addToCartHanlder = async (product: productType) => {
    dispatch(addToCart(product));

    const cartAddedProduct = products.find(
      (i: productType) => i._id === product._id
    );

    if (cartAddedProduct?.quantity! >= cartAddedProduct?.stock!) {
      return;
    }

    const res = await addToCartBackend({
      productId: product._id,
      userId: user?._id!,
    });
    ToasterFunction(res, "Cart Item Successfully Added");
  };

  // Get the Products
  useEffect(() => {
    const res = axios.get(
      `${process.env.NEXT_PUBLIC_VITE_BACKEND_SERVER}/api/v1/product/all?id=65b8fb1c9e0b09e6ef235e45`
    );
    res.then(({ data }) => {
      const modifiedData = data.productData.map((i: productType) => ({
        ...i,
        quantity: 0,
      }));
      setAllProducts(modifiedData);
      setLoading(false);
    });
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-black to-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-24 top-1/2 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
        <div className="absolute right-1/4 bottom-0 w-64 h-64 bg-indigo-900/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16 flex flex-col gap-2 items-center">
        <h2 className="text-3xl w-1/3  md:text-4xl font-bold text-white mb-4 relative inline-block tracking-tight">
            <span className="relative z-10">Featured Products</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></span>
          </h2>
          <div className="flex items-center justify-center mb-3 px-4 py-1.5 rounded-full bg-gray-800/70 backdrop-blur border border-gray-700">
            <Sparkles size={16} className="text-indigo-400 mr-2" />
            <span className="text-gray-300 text-sm font-medium">Premium Selection</span>
          </div>
          
 
          
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Discover our exclusive collection of premium products designed for you
          </p>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {allProducts.map((product: productType, i) => {
                if (i > 2) {
                  return null;
                }
                return (
                  <ProductCard
                    cartHandler={addToCartHanlder}
                    name={product.name}
                    price={product.price}
                    img={product.photo}
                    key={product._id}
                    product={product}
                  />
                );
              })}
            </div>
            
            {/* View all products button */}
            <div className="mt-12 md:mt-16 text-center">
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                <ShoppingBag size={18} className="mr-2" />
                <span>Browse All Products</span>
                <svg 
                  className="ml-2 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;