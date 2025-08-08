/**
 * SalaryInfo (simpler state version)
 *
 * Shows logged-in employee's payment history.
 * - Fetches *paginated* transaction data from server
 * - No URL query params
 */

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaMoneyBillWave, FaCalendarAlt, FaHashtag, FaThLarge, FaTable } from "react-icons/fa";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import DataTable from "../../Components/DataTable/DataTable";
import PaginationList from "../../Components/PaginatedList/PaginationList";
import Card from "./Card/Card";
import Loader from "../../Components/Loader/Loader";

const SalaryInfo = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuthProvidor();

  //  Simple local state
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });
  const [tableView, setTableView] = useState(true); // "table" or "card"
  const { page, perPageItem } = pageState;

  //  Query data using page/perPageItem
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["employeeTransactions", user?.email, page, perPageItem],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/transactions/${user?.email}?item=${perPageItem}&page=${page}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });
  // calculate total pages based on fetched data
  const transactions = data?.transactions || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);

  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  //  Table columns
  const columns = [
    { accessorKey: "pay_for_month", header: "Month" },
    { accessorKey: "pay_for_year", header: "Year" },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="text-green-600 font-semibold">
          ${row.original.amount}
        </span>
      ),
    },
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
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
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">My Salary History</h2>

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

      {/* Loading / Error */}
      {isLoading && <Loader />}
      {isError && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}
      {!isLoading && !isError && transactions.length === 0 && (
        <p className="text-center text-gray-500">No payment records found.</p>
      )}

      {/* Table view for large screens */}
      {!isLoading && !isError && transactions.length > 0 && (
        <>
          <div className="hidden lg:block">
            {tableView ? (
              <DataTable columns={columns} data={transactions} />
            ) : (
              <Card transactions={transactions} />
            )}
          </div>

          {/* Card view for mobile/tablet */}
          <div className="block lg:hidden">
            <Card transactions={transactions} />
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <PaginationList
              page={page}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SalaryInfo;
