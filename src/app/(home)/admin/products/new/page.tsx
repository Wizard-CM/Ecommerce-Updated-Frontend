"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import rootState from "@/Redux/RootState";
import { useCreateProductMutation } from "@/Redux/API/ProductApi";
import ToasterFunction from "@/components/Utility/ToasterFunction";

const NewProduct = () => {
  const { user } = useSelector((state: rootState) => state.userSlice);
  const [createProduct] = useCreateProductMutation();
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | null >(null);
  const [stock, setStock] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Handlers
  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.readyState === 2) {
          setPreviewUrl(fileReader.result as string);
        }
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const submitHanlder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    formData.set("name", name);
    formData.set("category", category);
    formData.set("stock", JSON.stringify(stock));
    formData.set("price", JSON.stringify(price));
    formData.set("photo", file!);
    formData.set("user", user?._id!);

    const res = await createProduct({ formData, id: user?._id! });

    ToasterFunction(res, "Product Successfully Created");
    router.push("/admin/products");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Create New Product
            </h2>
            <form onSubmit={submitHanlder} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-100 font-medium">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-100 font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(+e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-100 font-medium">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(+e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-100 font-medium">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter product category"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-gray-100 font-medium">
                  Product Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-500 hover:border-indigo-500 rounded-lg transition-all cursor-pointer">
                    <div className="flex flex-col items-center justify-center pt-7">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-100">
                        Select product image
                      </p>
                    </div>
                    <input
                      type="file"
                      onChange={fileHandler}
                      className="opacity-0"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-6 font-medium tracking-widest rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                CREATE PRODUCT
              </button>
            </form>
          </div>

          <div className="w-full md:w-1/2 bg-gray-900 p-8 flex items-center justify-center">
            <div className="text-center">
              {previewUrl ? (
                <div className="relative w-64 h-64 mx-auto rounded-lg overflow-hidden shadow-xl">
                  <Image
                    src={previewUrl}
                    alt="Product preview"
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto bg-gray-800 rounded-lg flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-700">
                  <svg
                    className="w-16 h-16 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p className="mt-4 text-gray-400 text-sm">
                    Product image preview will appear here
                  </p>
                </div>
              )}
              <p className="mt-4 text-gray-400 text-sm">
                Upload a high-quality image for your product
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
