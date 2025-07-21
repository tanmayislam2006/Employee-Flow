import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import DataTable from "../../../Components/DataTable/DataTable";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck, FaTable, FaThLarge } from "react-icons/fa";
import Swal from "sweetalert2";
import EditEmployeeModal from "./EditEmployeeModal";
import PaginationList from "../../../Components/PaginatedList/PaginationList";
import Card from "./Card/Card";
import Loader from "../../../Components/Loader/Loader";

/**
 * AdminAction component
 *
 * Shows all verified employees (including Fired)
 * Allows admin to Fire (mark as Fired) or Re-Activate
 * Allows editing employee info
 */
const AdminAction = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableView, setTableView] = useState(true); // "table" or "card"
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });

  const { page, perPageItem } = pageState;
  // Fetch all verified users
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["verified-users", page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?isVerified=true&page=${page}&item=${perPageItem}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const verifiedUsers = data?.employees || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);

  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  // Mutation: Toggle Fire / Re-Activate
  const { mutate: toggleStatus, isLoading: toggling } = useMutation({
    mutationFn: async ({ id, newStatus }) =>
      axiosSecure.patch(`/user/${id}`, { status: newStatus }),
    onSuccess: () => {
      toast.success("Status updated!");
      queryClient.invalidateQueries(["verified-users"]);
    },
    onError: () => toast.error("Failed to update status."),
  });

  // Mutation: Update employee info
  const { mutate: updateEmployee, isLoading: saving } = useMutation({
    mutationFn: async ({ _id, ...updatedData }) =>
      axiosSecure.patch(`/user/${_id}`, updatedData),
    onSuccess: () => {
      toast.success("Employee updated successfully!");
      queryClient.invalidateQueries(["verified-users"]);
      closeModal();
    },
    onError: () => toast.error("Failed to update employee."),
  });

  // Confirm and toggle status
  const handleToggleStatus = async (employee) => {
    const action = employee.status === "Fired" ? "Re-Activate" : "Fire";
    const newStatus = employee.status === "Fired" ? "Active" : "Fired";

    const confirm = await Swal.fire({
      title: `Are you sure to ${action}?`,
      text: `This will change the status to ${newStatus}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: "Cancel",
      confirmButtonColor: action === "Fire" ? "#e11d48" : "#16a34a",
      cancelButtonColor: "#6b7280",
    });

    if (confirm.isConfirmed) {
      toggleStatus({ id: employee._id, newStatus });
    }
  };

  // Open edit modal
  const openModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  // Handle save from modal
  const handleSave = (updatedData) => {
    updateEmployee(updatedData);
  };

  // Table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Profile",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.profileImage}
            alt={row.original.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <div className="font-bold">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "designation",
      header: "Designation",
      cell: ({ row }) => <span>{row.original.designation || "N/A"}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span
          onClick={() => openModal(row.original)}
          className="hover:underline cursor-pointer hover:text-blue-600"
        >
          {row.original.role}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.original.status === "Fired"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {row.original.status || "Active"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(row.original)}
            className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-600"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={() => handleToggleStatus(row.original)}
            className={`px-3 py-2 rounded flex items-center gap-2 text-xs cursor-pointer ${
              row.original.status === "Fired"
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
            disabled={toggling}
          >
            {row.original.status === "Fired" ? <FaCheck /> : <FaTrash />}
            {row.original.status === "Fired" ? "Re-Activate" : "Fire"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-primary">Verified Employees</h2>

        <button
          className="hidden lg:flex items-center gap-2 btn"
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

      {/* Table view for large screens */}
      <div className="hidden lg:block">
        {isLoading && <Loader />}
        {isError && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}
        {!isLoading && !isError && verifiedUsers.length === 0 && (
          <p className="text-center text-gray-500">
            No verified employees found.
          </p>
        )}
        {!isLoading && !isError && verifiedUsers.length > 0 && (
          <div className="hidden lg:block">
            {tableView ? (
              <DataTable columns={columns} data={verifiedUsers} />
            ) : (
              <Card
                isLoading={isLoading}
                isError={isError}
                error={error}
                verifiedUsers={verifiedUsers}
                openModal={openModal}
                handleToggleStatus={handleToggleStatus}
                toggling={toggling}
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
          verifiedUsers={verifiedUsers}
          openModal={openModal}
          handleToggleStatus={handleToggleStatus}
          toggling={toggling}
        />
      </div>

      {/* Modal */}
      <EditEmployeeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        employee={editingEmployee}
        handleSave={handleSave}
        saving={saving}
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

export default AdminAction;
