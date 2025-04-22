"use client";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
  } from "react-icons/ai";
  import { Column, useTable, useSortBy, usePagination } from "react-table";
  import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
  
  
  
  function TableHOC<T extends Object>(
    columns: Column<T>[],
    data: T[],
    showPagination: boolean
  ) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      // Pagination Main use varibales
      pageCount,
      previousPage,
      nextPage,
      canNextPage,
      canPreviousPage,
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: {
          pageSize: 6,
        },
      },
      useSortBy,
      usePagination
    );
    return function () {
      return (
        <div className="w-full overflow-x-auto bg-gradient-to-br from-black to-gray-900 p-4 rounded-lg shadow-xl">
          <div className="min-w-full">
            <table {...getTableProps()} className="w-full border-collapse">
              <thead className="bg-gray-800 border-b border-gray-700">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="text-left">
                    {headerGroup.headers.map((column) => (
                      <th 
                        {...column.getHeaderProps(column.getSortByToggleProps())} 
                        className="px-4 py-3 text-gray-100 font-semibold text-sm md:text-base uppercase tracking-wider cursor-pointer transition-colors hover:bg-gray-700"
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.render("Header")}</span>
                          <span className="text-lg">
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <AiOutlineSortAscending className="text-purple-500" />
                              ) : (
                                <AiOutlineSortDescending className="text-purple-500" />
                              )
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
  
              <tbody {...getTableBodyProps()} className="divide-y divide-gray-700">
                {page.map((row, i) => {
                  prepareRow(row);
                  return (
                    <tr 
                      {...row.getRowProps()} 
                      className={`text-gray-100 hover:bg-gray-800 transition-colors ${i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-950'}`}
                    >
                      {row.cells.map((cell) => {
                        return (
                          <td 
                            {...cell.getCellProps()} 
                            className="px-4 py-3 text-sm md:text-base whitespace-nowrap"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* pagination */}
          {(showPagination && data.length > pageSize) && (
            <div className="flex items-center justify-between mt-4 text-gray-100 px-2 py-3">
              <div className="flex-1 text-sm md:text-base">
                Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min((pageIndex + 1) * pageSize, data.length)}
                </span>{" "}
                of <span className="font-medium">{data.length}</span> results
              </div>
              
              <div className="flex items-center space-x-2 md:space-x-4">
                <button 
                  onClick={() => previousPage()} 
                  disabled={!canPreviousPage}
                  className={`flex items-center justify-center px-3 py-2 text-sm md:text-base rounded-md transition-all ${
                    canPreviousPage 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90" 
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FiChevronLeft className="mr-1" />
                  Prev
                </button>
                
                <span className="font-medium text-sm md:text-base">
                  {pageIndex + 1} of {pageCount}
                </span>
                
                <button 
                  onClick={() => nextPage()} 
                  disabled={!canNextPage}
                  className={`flex items-center justify-center px-3 py-2 text-sm md:text-base rounded-md transition-all ${
                    canNextPage 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90" 
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <FiChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      );
    };
  }
  
  export default TableHOC;
  