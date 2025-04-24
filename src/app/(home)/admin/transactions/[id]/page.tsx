"use client"
import React, { useState } from "react";
import { FaTrash, FaBox, FaTruck, FaCheckCircle, FaShippingFast } from "react-icons/fa";
import { BsCurrencyDollar, BsGeoAlt } from "react-icons/bs";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import rootState from "@/Redux/RootState";
import { useDeleteOrderMutation, useSingleOrderQuery, useUpdateOrderMutation } from "@/Redux/API/OrderApi";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import PageLoader from "@/components/Utility/PageLoader";
import { use } from "react";

type Params = {
  id: string;
};

const TransactionManagement = ({ params }: { params: Promise<Params> }) => {
  const { user } = useSelector((state: rootState) => state.userSlice);
  const router = useRouter();
  const {id:orderId} = use(params);
  
  const { data, isLoading } = useSingleOrderQuery({
    id: user?._id!,
    orderId: orderId!,
  });
  
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  // Handlers
  const deleteHandler = async () => {
    const res = await deleteOrder({ orderId: orderId!, id: user?._id! });
    ToasterFunction(res, "Order Successfully Deleted");
    return router.push("/admin/transactions");
  };
  
  const updateHandler = async () => {
    const res = await updateOrder({ orderId: orderId!, id: user?._id! });
    ToasterFunction(res, "Order Successfully Updated");
  };

  const shippingInfo = data?.orderData.shippingInfo;
  
  // Helper to format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  console.log(data);

  const getStatusIcon = () => {
    const status = data?.orderData?.status;
    if (status === "Delivered") return <FaCheckCircle className="text-purple-500 text-xl mr-2" />;
    if (status === "Shipped") return <FaTruck className="text-green-500 text-xl mr-2" />;
    return <FaBox className="text-red-500 text-xl mr-2" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 p-4 md:p-6 lg:p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <PageLoader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 md:p-6 bg-gray-800 border-b border-gray-700">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Order Details</h1>
            <p className="text-gray-400">Order ID: {orderId}</p>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Order Items Section */}
            <div className="lg:w-3/5 p-4 md:p-6 bg-gray-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaShippingFast className="mr-2 text-indigo-500" /> ORDER ITEMS
                </h2>
                <span className="text-sm text-gray-400">{data?.cartItemData.length} items</span>
              </div>
              
              <div className="space-y-4">
                {data?.cartItemData.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col sm:flex-row bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-all duration-300"
                  >
                    <div className="relative h-40 sm:h-24 sm:w-24 md:h-32 md:w-32 overflow-hidden bg-gray-700 flex-shrink-0">
                      {
                        item?.photo &&        <Image
                        src={`${item?.photo}`}
                        alt={item?.name || "Product image"}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-110"
                      />
                      }
     
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white truncate">{item?.name}</h3>
                        <p className="text-gray-400 mt-1 text-sm">Product ID: {item?._id?.substring(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Info Section */}
            <div className="lg:w-2/5 p-4 md:p-6 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-700">
              <div className="relative bg-gray-800 rounded-xl shadow-lg p-5">
                <button 
                  className="absolute top-4 right-4 hover:bg-red-700 bg-red-600 text-white p-2 rounded-full transition-all duration-300"
                  onClick={deleteHandler}
                  aria-label="Delete Order"
                >
                  <FaTrash />
                </button>
                
                <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-gray-700">ORDER INFORMATION</h2>
                
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h5 className="text-indigo-400 font-medium mb-3 flex items-center">
                      <BsGeoAlt className="mr-2" /> SHIPPING DETAILS
                    </h5>
                    <div className="space-y-2 text-gray-100">
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Country:</span> 
                        {shippingInfo?.country.toLocaleUpperCase()}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Address:</span> 
                        {shippingInfo?.address}
                      </p>
                    </div>
                  </div>
                  
                  {/* Amount Info */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h5 className="text-indigo-400 font-medium mb-3">PAYMENT DETAILS</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-100">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(data?.orderData?.subTotal || 0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-100">
                        <span>Shipping:</span>
                        <span>{formatCurrency(data?.orderData?.shippingCharge || 0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-100">
                        <span>Tax:</span>
                        <span>{formatCurrency(data?.orderData?.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-100">
                        <span>Discount:</span>
                        <span>-{formatCurrency(data?.orderData?.discount || 0)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-white pt-2 border-t border-gray-700 mt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(data?.orderData?.total || 0)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Status Info */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h5 className="text-indigo-400 font-medium mb-3">ORDER STATUS</h5>
                    <div className="text-gray-100">
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">Current Status:</span>
                        <span className="flex items-center">
                          {getStatusIcon()}
                          <span
                            className={`font-medium ${
                              data?.orderData?.status === "Delivered"
                                ? "text-purple-400"
                                : data?.orderData?.status === "Shipped"
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {data?.orderData?.status}
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                    onClick={updateHandler}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
