"use client";
import TableHOC from "@/components/Admin/AdminUitlities/TableHOC";
import Loader from "@/components/Utility/Loader";
import PageLoader from "@/components/Utility/PageLoader";
import { getAllProducts } from "@/Redux/API/ProductApi";
import rootState from "@/Redux/RootState";
import { productType } from "@/types/API-Types";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";

type productDataType = {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
};

const columns: Column<productDataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const { user } = useSelector((state: rootState) => state.userSlice);
  const [allProducts, setAllProducts] = useState<productDataType[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts(user?._id!);
        const { productData } = res;

        const modifiedData = productData.map((i: productType) => {
          return {
            photo: (
              <div className="relative w-16 h-16 rounded-md overflow-hidden">
                <img
                  src={`${i.photo}`}
                  alt={i.name}
                  className="object-cover w-full h-full"
                />
              </div>
            ),
            name: i.name,
            price: i.price,
            stock: i.stock,
            action: (
              <Link
                href={`/admin/products/${i._id}`}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Manage
              </Link>
            ),
          };
        });

        setAllProducts(modifiedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchProducts();
    }
  }, [user]);

  const JSX = TableHOC(columns, allProducts, true)();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-gray-900 text-gray-100 p-4 md:p-6 ">
      {loading ? (
        <div className="flex justify-center items-center min-h-[80vh]">
          <PageLoader />
        </div>
      ) : (
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0 text-white">
              Products Management
            </h2>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all"
            >
              <FaPlus /> Add New Product
            </Link>
          </div>

          <div className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden shadow-xl border  border-white/50">
            <div className="overflow-x-auto w-full">
              {allProducts.length > 0 ? (
                <div className="custom-table-container">{JSX}</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <p className="text-lg text-gray-400 mb-4">
                    No products found
                  </p>
                  <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all"
                  >
                    <FaPlus /> Add Your First Product
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile floating action button */}
          <div className="md:hidden fixed bottom-6 right-6">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:opacity-90 transition-all"
            >
              <FaPlus size={20} />
            </Link>
          </div>
        </div>
      )}

      <style>
        {`
        /* Custom styles for the table */
        .custom-table-container table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .custom-table-container th {
          background-color: rgba(31, 41, 55, 0.8);
          color: white;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          font-size: 0.875rem;
          text-transform: uppercase;
        }
        
        .custom-table-container td {
          padding: 1rem;
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
          color: #f3f4f6;
        }
        
        .custom-table-container tr:hover td {
          background-color: rgba(55, 65, 81, 0.4);
        }
        
        .table-pagination {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 1rem;
          gap: 1rem;
        }
        
        .table-pagination button {
          padding: 0.5rem 1rem;
          background: linear-gradient(to right, #4f46e5, #7c3aed);
          color: white;
          border-radius: 0.375rem;
          border: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .table-pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: rgba(75, 85, 99, 0.5);
        }
        
        .table-pagination span {
          color: #f3f4f6;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .custom-table-container th,
          .custom-table-container td {
            padding: 0.75rem 0.5rem;
            font-size: 0.875rem;
          }
          
          .custom-table-container th:nth-child(4),
          .custom-table-container td:nth-child(4) {
            display: none;
          }
        }
        
        @media (max-width: 640px) {
          .custom-table-container th:nth-child(3),
          .custom-table-container td:nth-child(3) {
            display: none;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Products;
