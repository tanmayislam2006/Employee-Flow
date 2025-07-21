import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import {
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaThLarge,
  FaTable,
} from "react-icons/fa";
import DataTable from "../../../Components/DataTable/DataTable";
import { useState } from "react";
import PaginationList from "../../../Components/PaginatedList/PaginationList";
import Card from "./Card/Card";
import Loader from "../../../Components/Loader/Loader";

const PayHistory = () => {
  const axiosSecure = useAxiosSecure();
  const [tableView, setTableView] = useState(true); // "table" or "card"
  //  Simple local state
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });
  const { page, perPageItem } = pageState;
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payHistory", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `transactions?item=${perPageItem}&page=${page}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const payHistory = data?.transactions || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);
  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  // Table columns
  const columns = [
    {
      accessorKey: "employeeName",
      header: "Name",
    },
    {
      accessorKey: "employeeEmail",
      header: "Email",
      cell: ({ row }) => (
        <span className="break-all text-sm">{row.original.employeeEmail}</span>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <span className="text-green-600 font-semibold">
          ${row.original.amount}
        </span>
      ),
    },
    {
      accessorKey: "pay_for_month",
      header: "Month",
      cell: ({ row }) => (
        <span className="font-mono tracking-wide">
          {row.original.pay_for_month}
        </span>
      ),
    },
    {
      accessorKey: "pay_for_year",
      header: "Year",
    },
    {
      accessorKey: "transactionId",
      header: "Transaction",
      cell: ({ row }) => (
        <span className="break-all text-xs text-gray-500">
          {row.original.transactionId}
        </span>
      ),
    },
    {
      accessorKey: "paid_at",
      header: "Paid At",
      cell: ({ row }) => (
        <span className="text-xs text-gray-600">
          {new Date(row.original.paid_at).toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => (
        <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
          <FaCheckCircle /> Paid
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Pay History</h2>

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

      {/* Table view for large devices */}
      <div className="hidden lg:block">
        {isLoading && <Loader />}
        {isError && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}
        {!isLoading && !isError && payHistory.length === 0 && (
          <p className="text-center text-gray-500">No payment records found.</p>
        )}
        {!isLoading && !isError && payHistory.length > 0 && (
          <div className="hidden lg:block">
            {tableView ? (
              <DataTable columns={columns} data={payHistory} />
            ) : (
              <Card
                isLoading={isLoading}
                isError={isError}
                error={error}
                payHistory={payHistory}
              />
            )}
          </div>
        )}
      </div>

      {/* Card view for small/medium devices */}
      <div className="block lg:hidden">
        <Card
          isLoading={isLoading}
          isError={isError}
          error={error}
          payHistory={payHistory}
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

export default PayHistory;
