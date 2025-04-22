"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaTrash, FaUpload, FaBox, FaTag, FaRupeeSign } from "react-icons/fa";
import Image from "next/image";
import { useSelector } from "react-redux";
import rootState from "@/Redux/RootState";
import { useParams, useRouter } from "next/navigation";
import { useDeleteProductMutation, useSingleProductQuery, useUpdateProductDataMutation } from "@/Redux/API/ProductApi";
import ToasterFunction from "@/components/Utility/ToasterFunction";
import Loader from "@/components/Utility/Loader";
import PageLoader from "@/components/Utility/PageLoader";

const initialData = {
  name: "",
  price: 0,
  stock: 0,
  category: "",
  photo: "",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const ProductManagement = ({ params }: PageProps) => {
  const { user } = useSelector((state: rootState) => state.userSlice);
  const resolvedParams = React.use(params);
  const id = resolvedParams.id;
  const { data, isLoading } = useSingleProductQuery(id!); // rememeber this is a hook
  const [updateProductData] = useUpdateProductDataMutation();
  const [deleteProductData] = useDeleteProductMutation();
  const router = useRouter();

  // Update States
  const { name, price, category, stock, photo } =
    data?.productData || initialData;
  const [updateName, setUpdateName] = useState<string>(name);
  const [updatePrice, setUpdatePrice] = useState<number>(price);
  const [updateStock, setUpdateStock] = useState<number>(stock);
  const [updateCategory, setUpdateCategory] = useState<string>(category);
  const [photoo, setPhotoo] = useState<File>();
  const [photoFile, setPhotoFiles] = useState<string | null>(null);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setPhotoo(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          setPhotoFiles(reader.result as string);
        };
      }
    }
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.set("name", updateName);
    formData.set("category", updateCategory);
    formData.set("stock", JSON.stringify(updateStock));
    formData.set("price", JSON.stringify(updatePrice));
    formData.set("photo", photoo!);
    const res = await updateProductData({
      data: formData,
      productId: params.id!,
      userId: user?._id!,
    });

    ToasterFunction(res, "Product Successfully Updated");
    router.push("/admin/products");
  };

  const deleteHandler = async () => {
    const res = await deleteProductData({ userId: user?._id!, productId: params.id! });
    ToasterFunction(res, "Product Successfully Deleted");
    router.push("/admin/products");
  };

  useEffect(() => {
    setUpdateName(data?.productData.name!);
    setUpdatePrice(data?.productData.price!);
    setUpdateCategory(data?.productData.category!);
    setUpdateStock(data?.productData.stock!);
  }, [data]);

  return (
    <div className="w-full py-6 px-4 md:px-8">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[500px]">
          <PageLoader />
        </div>
      ) : (
        <div className="bg-gradient-to-br from-black to-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="relative w-full pb-4">
            <h2 className="text-3xl font-bold text-center text-white py-6">Product Management</h2>
            <button 
              className="absolute top-6 right-6 p-2 text-red-500 hover:text-red-300 transition-colors"
              onClick={deleteHandler}
            >
              <FaTrash size={20} />
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Product Preview Section */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-400 text-sm">ID: {params.id?.substring(0, 12) || "298nfksnnr9n3"}...</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${stock >= 1 ? 'bg-green-500 bg-opacity-80 text-white' : 'bg-red-500 bg-opacity-80 text-white'}`}>
                    {stock >= 1 ? `${stock} In Stock` : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="relative mt-2 mb-6 flex-grow">
                  <div className="w-full h-64 md:h-80 relative rounded-lg overflow-hidden border-2 border-gray-700">
                    {photoFile || photo ? (
                      <img 
                        src={photoFile || `${photo}`} 
                        alt={name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <p className="text-gray-400">No Image Available</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-white mb-2">{name}</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-gray-300">
                      <FaTag className="mr-2" /> 
                      <span>{category}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaBox className="mr-2" /> 
                      <span>{stock} units</span>
                    </div>
                    <div className="flex items-center text-2xl font-bold text-white mt-2">
                      <FaRupeeSign className="mr-1" size={18} /> 
                      {price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Edit Form Section */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6 h-full">
                <form onSubmit={submitHandler} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-gray-300 block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      value={updateName}
                      onChange={(e) => setUpdateName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-300 block text-sm font-medium mb-1">Price (₹)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRupeeSign className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={updatePrice}
                        onChange={(e) => setUpdatePrice(+e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter price"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-300 block text-sm font-medium mb-1">Stock</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaBox className="text-gray-400" />
                      </div>
                      <input
                        type="number"
                        value={updateStock}
                        onChange={(e) => setUpdateStock(+e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter stock quantity"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-300 block text-sm font-medium mb-1">Category</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaTag className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={updateCategory}
                        onChange={(e) => setUpdateCategory(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        placeholder="Enter category"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-300 block text-sm font-medium mb-1">Product Image</label>
                    <label className="flex flex-col items-center px-4 py-6 bg-gray-700 border border-gray-600 border-dashed rounded-lg cursor-pointer hover:bg-gray-600 transition-all">
                      <div className="flex flex-col items-center justify-center">
                        <FaUpload className="text-gray-400 mb-2" size={24} />
                        <p className="text-sm text-gray-400">
                          {photoo ? photoo.name : "Click to upload a new image"}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition-all"
                    >
                      Update Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
