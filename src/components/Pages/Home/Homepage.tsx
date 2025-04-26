import { useAddToCartBackendMutation } from "@/Redux/API/CartApi";
import { addToCart } from "@/Redux/Reducers/cartReducer";
import rootState from "@/Redux/RootState";
import { productType } from "@/types/API-Types";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ToasterFunction from "../../Utility/ToasterFunction";

const Homepage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const [addToCartBackend] = useAddToCartBackendMutation();
  const { user } = useSelector((state: rootState) => state.userSlice);
  const { products } = useSelector((state: rootState) => state.cartSlice);

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
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-purple-900/20 to-indigo-900/20"></div>

          <div className="absolute top-20 left-1/4 w-24 h-24 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-10 right-1/3 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-blue-500/10 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iY3VycmVudENvbG9yIiBvcGFjaXR5PSIuNSIvPjxwYXRoIGQ9Ik0zMCAwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6IiBmaWxsPSJjdXJyZW50Q29sb3IiIG9wYWNpdHk9Ii4yNSIvPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block mb-6 px-4 py-1.5 bg-indigo-900/30 backdrop-blur-sm text-indigo-300 text-sm font-medium rounded-full border border-indigo-700/30">
                <span className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
                  New Collection Available
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-100">Discover Next-Gen</span>
                <br className="hidden sm:block" />
                <span className="relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                    Products
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-indigo-500/30"
                    viewBox="0 0 100 12"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,0 Q50,12 100,0" fill="currentColor" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg sm:text-xl mb-8 text-gray-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
                Transform your digital experience with our innovative platform
                designed for the future. Join thousands of satisfied customers.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">10K+</div>
                  <div className="text-sm text-gray-500">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">98%</div>
                  <div className="text-sm text-gray-500">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-400">24/7</div>
                  <div className="text-sm text-gray-500">Support</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="#"
                  className="group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                >
                  <Link href="/products" className="relative z-10 flex items-center justify-center" >
                    Shop Now
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>

                <button
                  className="px-8 py-4 rounded-full border border-indigo-700 text-gray-300 font-semibold text-lg hover:bg-indigo-900/50 hover:border-indigo-500/50 transition-all duration-300 backdrop-blur-sm flex items-center justify-center cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Learn More
                </button>
              </div>
            </div>

            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-indigo-500 rounded-full filter blur-3xl opacity-10"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>

                <div className="relative p-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl overflow-hidden">
                  <div className="backdrop-blur-sm bg-gray-900/50 rounded-xl overflow-hidden">
                    <div className="relative aspect-video md:aspect-square w-full max-w-lg mx-auto overflow-hidden group">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                        alt="Product Showcase"
                        className="w-full h-full object-cover rounded-xl"
                      />

                      <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-900/70 backdrop-blur-sm text-indigo-300 text-sm font-medium rounded-full border border-indigo-700/40">
                        Premium Feature
                      </div>

                      <div className="absolute bottom-4 right-4 px-3 py-1 bg-purple-900/70 backdrop-blur-sm text-purple-300 text-sm font-medium rounded-full border border-purple-700/40">
                        New Release
                      </div>

                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="flex justify-between items-end">
                          <div>
                            <h3 className="text-gray-100 font-bold">
                              Premium Package
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Limited edition release
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center hover:bg-indigo-700 transition-colors duration-300 transform group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/50 cursor-pointer">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-3 top-1/4 flex flex-col gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;
