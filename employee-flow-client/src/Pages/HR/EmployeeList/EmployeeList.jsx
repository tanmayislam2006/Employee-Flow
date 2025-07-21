import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FaTimesCircle,
  FaCheckCircle,
  FaEye,
  FaDollarSign,
  FaUniversity,
  FaThLarge,
  FaTable,
} from "react-icons/fa";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import DataTable from "../../../Components/DataTable/DataTable";
import { toast } from "react-toastify";
import PayModal from "./PayModal";
import { useNavigate } from "react-router";
import PaginationList from "../../../Components/PaginatedList/PaginationList";
import Card from "./Card/Card";
import Loader from "../../../Components/Loader/Loader";
const EmployeeList = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });

  const { page, perPageItem } = pageState;
  // ----------------------------------------------------
  // STATE: For controlling the Pay Modal
  // ----------------------------------------------------
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tableView, setTableView] = useState(true); // "table" or "card"

  // ----------------------------------------------------
  // React Query: Fetch all employee data
  // ----------------------------------------------------
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-employees", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?page=${page}&item=${perPageItem}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const employees = data?.employees || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);

  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  // ----------------------------------------------------
  // Mutation: Toggle Employee Verify Status
  // PATCH /user/:id/verify
  // ----------------------------------------------------
  const { mutate: handleVerify } = useMutation({
    mutationFn: async (employee) => {
      const newStatus = !employee.isVerified;
      return axiosSecure.patch(`/user/${employee._id}/verify`, {
        isVerified: newStatus,
      });
    },
    onSuccess: () => {
      toast.success("Verification status updated!");
      refetch();
      queryClient.invalidateQueries(["all-employees"]);
    },
    onError: () => {
      toast.error("Failed to update verification status.");
    },
  });

  // ----------------------------------------------------
  // Mutation: Create Payroll Payment Request
  // POST /payroll
  // ----------------------------------------------------
  const { mutate: handlePayRequest } = useMutation({
    mutationFn: async (paymentData) => {
      return axiosSecure.post("/payRoll", paymentData);
    },
    onSuccess: () => {
      toast.success("Payment request created successfully!");
      closePayModal();
    },
    onError: () => {
      toast.error("Failed to create payment request.");
    },
  });

  // ----------------------------------------------------
  // Handlers for opening/closing modal
  // ----------------------------------------------------
  const openPayModal = (employee) => {
    setSelectedEmployee(employee);
    setPayModalOpen(true);
  };

  const closePayModal = () => {
    setSelectedEmployee(null);
    setPayModalOpen(false);
  };

  // ----------------------------------------------------
  // Handler for submitting modal payment form
  // ----------------------------------------------------
  const handlePaySubmit = (formData) => {
    // here just get all form data and employee pay details
    // Call mutation
    const payRollData = {
      ...formData,
      status: "pending",
      payrequest_at: new Date().toISOString(),
    };
    handlePayRequest(payRollData);
  };

  // ----------------------------------------------------
  // Columns for DataTable
  // ----------------------------------------------------
  const navigate = useNavigate();
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) =>
        row.original.isVerified ? (
          <button
            onClick={() => handleVerify(row.original)}
            className="mx-auto text-green-500 hover:text-green-600 cursor-pointer"
            title="Click to unverify"
          >
            <FaCheckCircle size={20} />
          </button>
        ) : (
          <button
            onClick={() => handleVerify(row.original)}
            className="mx-auto text-red-500 hover:text-red-600 cursor-pointer"
            title="Click to verify"
          >
            <FaTimesCircle size={20} />
          </button>
        ),
    },
    {
      accessorKey: "bank_account",
      header: "Bank Account",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FaUniversity className="text-blue-500" />
          <span>{row.original.bank_account || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-emerald-600">
          <FaDollarSign /> {row.original.salary || 0}
        </div>
      ),
    },
    {
      header: "Pay",
      cell: ({ row }) => (
        <button
          onClick={() => openPayModal(row.original)}
          className={`bg-primary text-white px-3 py-1 rounded text-sm font-medium cursor-pointer ${
            !row.original.isVerified ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!row.original.isVerified}
        >
          Pay
        </button>
      ),
    },
    {
      header: "Details",
      cell: ({ row }) => (
        <button
          onClick={() => navigate(`/dashboard/details/${row.original.email}`)}
          className="text-blue-600 hover:underline text-sm flex items-center gap-1 cursor-pointer"
        >
          <FaEye /> View
        </button>
      ),
    },
  ];

  // ----------------------------------------------------
  // Return Component JSX
  // ----------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Employee List</h2>

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

      {/* Table for lg+ screens */}
      <div className="hidden lg:block">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="hidden lg:block">
            {tableView ? (
              <DataTable columns={columns} data={employees} />
            ) : (
              <Card
                employees={employees}
                isLoading={isLoading}
                handleVerify={handleVerify}
                openPayModal={openPayModal}
                navigate={navigate}
              />
            )}
          </div>
        )}
      </div>

      {/* Card view for small devices */}
      <div className="block lg:hidden">
        <Card
          employees={employees}
          isLoading={isLoading}
          handleVerify={handleVerify}
          openPayModal={openPayModal}
          navigate={navigate}
        />
      </div>

      {/* -------------------------------------------------
          PayModal Component
          - Props: isOpen, onClose, onSubmit, employee
          ------------------------------------------------- */}
      <PayModal
        isOpen={payModalOpen}
        onClose={closePayModal}
        handlePaySubmit={handlePaySubmit}
        employee={selectedEmployee}
      />
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

export default EmployeeList;
