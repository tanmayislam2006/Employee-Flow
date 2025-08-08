import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import DataTable from "../../../Components/DataTable/DataTable";
import { useNavigate } from "react-router";
import PaginationList from "../../../Components/PaginatedList/PaginationList";
import { useState } from "react";
import { FaTable, FaThLarge } from "react-icons/fa";
import Card from "./Card/Card";
import Loader from "../../../Components/Loader/Loader";

/**
 * PaySheets
 *
 * Loads payroll entries from the server and displays
 * them in a simple TanStack Table.
 */
const PaySheets = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [tableView, setTableView] = useState(true); // "table" or "card"
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });

  const { page, perPageItem } = pageState;
  // Fetch payroll data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payRolls", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payRolls?status=pending&item=${perPageItem}&page=${page}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const payRolls = data?.payRolls || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);

  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  // Define columns for the table
  const columns = [
    {
      accessorKey: "employeeName",
      header: "Name",
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <span className="text-green-600 font-medium">
          ${row.original.salary}
        </span>
      ),
    },
    {
      accessorKey: "month",
      header: "Month",
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <button
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate(`/dashboard/payment/${row.original._id}`)}
        >
          Pay
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Pay Sheets</h2>

        <button
          className="hidden lg:flex items-center gap-2 btn "
          onClick={() => setTableView(!tableView)}
        >
          {tableView ? (
            <>
              <FaThLarge /> Card View
            </>
          ) : (
            <>
              <FaTable /> Table View
            </>
          )}
        </button>
      </div>
      {/* tabele view for large screens */}
      <div className="hidden lg:block">
        {isLoading && (
         <Loader/>
        )}

        {isError && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}

        {!isLoading && !isError && payRolls.length === 0 && (
          <p className="text-center text-gray-500">No payroll entries found.</p>
        )}

        {!isLoading && !isError && payRolls.length > 0 && (
          <div className="hidden lg:block">
            {tableView ? (
              <DataTable columns={columns} data={payRolls} />
            ) : (
              <Card
                isLoading={isLoading}
                isError={isError}
                error={error}
                payRolls={payRolls}
                navigate={navigate}
              />
            )}
          </div>
        )}
      </div>
      {/* Card view for mobile and tablet */}
      <div className="block lg:hidden">
        <Card
          isLoading={isLoading}
          isError={isError}
          error={error}
          payRolls={payRolls}
          navigate={navigate}
        />
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationList
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PaySheets;
