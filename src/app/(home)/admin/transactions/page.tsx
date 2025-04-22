"use client";

import { ReactElement, useEffect, useState } from "react";
import Link from "next/link";
import { Column } from "react-table";
import { useSelector } from "react-redux";
import { useAllOrdersQuery } from "@/Redux/API/OrderApi";
import rootState from "@/Redux/RootState";
import TableHOC from "@/components/Admin/AdminUitlities/TableHOC";
import PageLoader from "@/components/Utility/PageLoader";

type transactionDataType = {
  avatar: string;
  amount: number;
  discount: number;
  quantity: number;
  status: ReactElement;
  action: ReactElement;
};

const columns: Column<transactionDataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Transactions = () => {
  const [rows, setRows] = useState<transactionDataType[]>([]);
  const { user } = useSelector((state: rootState) => state.userSlice);
  let tableData: transactionDataType[] = [];
  const { data: transactionData, isLoading } = useAllOrdersQuery(user?._id!);

  useEffect(() => {
    if (transactionData) {
      console.log(transactionData.orderData);
      if (transactionData?.orderData) {
        tableData = transactionData?.orderData.map((i) => {
          return {
            avatar: i.user?.username,
            amount: i?.total,
            quantity: i?.quantity,
            discount: i?.discount,
            status: (
              <span
                className={
                  i.status === "Processing"
                    ? "px-2 py-1 text-xs font-semibold rounded-full bg-red-600 text-white"
                    : i.status === "Shipped"
                    ? "px-2 py-1 text-xs font-semibold rounded-full bg-green-600 text-white"
                    : "px-2 py-1 text-xs font-semibold rounded-full bg-purple-600 text-white"
                }
              >
                {i.status}
              </span>
            ),
            action: (
              <Link
                href={`/admin/transactions/${i._id}`}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-md text-sm hover:opacity-90 transition-opacity"
              >
                Manage
              </Link>
            ),
          };
        });
      }

      setRows(tableData);
    }
  }, [transactionData]);

  const JSX = TableHOC(columns, rows, true)();

  return (
    <div className="bg-gradient-to-br from-black to-gray-900 min-h-screen text-gray-100 p-6 ">
      <div className="max-w-7xl mx-auto border  border-white/50 rounded-xl">
        <div className="bg-gray-800 min-h-[500px] bg-opacity-70 rounded-xl shadow-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-white border-b  border-b-white/50 pb-4">
            Transactions
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <PageLoader />
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg shadow-lg">{JSX}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
