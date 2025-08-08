import { FaInfoCircle, FaTable, FaThLarge, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import DataTable from "../../../Components/DataTable/DataTable";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../../../Components/Loader/Loader";
import PaginationList from "../../../Components/PaginatedList/PaginationList";
import { useState } from "react";
import Card from "./Card/Card";
import useAuthProvidor from "../../../Hook/useAuthProvidor";

const PayRequest = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuthProvidor();
  //  Simple local state
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 6,
  });
  const [tableView, setTableView] = useState(true); // "table" or "card"
  const { page, perPageItem } = pageState;

  // ✅ 1. Fetch payroll data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payRolls", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payRolls?item=${perPageItem}&page=${page}&hrEmail=${user?.email}`
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

  // ✅ 2. Delete mutation
  const { mutate: deletePayRoll, isLoading: deleting } = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/payRoll/${id}`),
    onSuccess: () => {
      toast.success("Payroll request deleted!");
      queryClient.invalidateQueries(["payRolls"]);
    },
    onError: () => toast.error("Failed to delete payroll request."),
  });

  // ✅ 3. Confirm deletion
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Payroll Request?",
      text: "Are you sure you want to delete this pending payment request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });
    if (confirm.isConfirmed) {
      deletePayRoll(id);
    }
  };

  // ✅ 4. DataTable columns for large screens
  const columns = [
    {
      accessorKey: "employeeName",
      header: "Name",
    },
    {
      accessorKey: "employeeEmail",
      header: "Email",
      cell: ({ row }) => (
        <span className="break-all">{row.original.employeeEmail}</span>
      ),
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
      cell: ({ row }) => (
        <span className="font-mono tracking-widest">{row.original.month}</span>
      ),
    },
    {
      accessorKey: "year",
      header: "Year",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.original.status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.original.status === "paid" ? "Paid" : "Pending"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            title="View Info"
            onClick={() =>
              toast.info(
                `Request At: ${new Date(
                  row.original.payrequest_at
                ).toLocaleString()}`
              )
            }
          >
            <FaInfoCircle size={18} />
          </button>

          {row.original.status === "pending" && (
            <button
              className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
              title="Delete Request"
              onClick={() => handleDelete(row.original._id)}
              disabled={deleting}
            >
              <FaTrash size={18} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Pay Request Sheets</h2>

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

      {/* ✅ Large screens table */}
      <div className="hidden lg:block">
        {isLoading && <Loader />}
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
                handleDelete={handleDelete}
                deleting={deleting}
              />
            )}
          </div>
        )}
      </div>

      {/* ✅ Small screens card view */}
      <div className="block lg:hidden">
        <Card
          isLoading={isLoading}
          isError={isError}
          error={error}
          payRolls={payRolls}
          handleDelete={handleDelete}
          deleting={deleting}
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

export default PayRequest;
