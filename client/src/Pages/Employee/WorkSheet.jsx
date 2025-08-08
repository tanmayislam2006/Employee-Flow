import { useForm } from "react-hook-form";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import useAxiosSecure from "./../../Hook/useAxiosSecure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import DataTable from "../../Components/DataTable/DataTable";
import PaginationList from "../../Components/PaginatedList/PaginationList";

// Task options for select input
const TASK_OPTIONS = ["Sales", "Support", "Content", "Paper-work", "Other"];

const WorkSheet = () => {
  // Get current user and axios instance
  const { user } = useAuthProvidor();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Modal state for editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  // added state for pagination
  const [pageState, setPageState] = useState({
    page: 1,
    perPageItem: 5,
  });
  const { page, perPageItem } = pageState;
  // React Hook Form setup for add form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });

  // Fetch all worksheet entries for the current user
  const { data, refetch } = useQuery({
    queryKey: ["employee-sheets", user?.email, page, perPageItem],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/myWorkSheet/${user?.email}?item=${perPageItem}&page=${page}`
      );
      return res.data;
    },
  });
  // calculate total pages based on fetched data
  const myEntries = data?.myEntries || [];
  const totalItems = data?.totalItems || 0;
  const totalPages = Math.ceil(totalItems / perPageItem);

  //  Handle page change
  const handlePageChange = (newPage) => {
    setPageState((prev) => ({
      ...prev,
      page: newPage,
    }));
  };
  // Mutation for adding a new worksheet entry
  const { mutate: addSheet } = useMutation({
    mutationFn: (sheetData) => axiosSecure.post("/workSheet", sheetData),
    onSuccess: () => {
      toast.success("Work Data Added Successfully");
      reset();
      // Invalidate and refetch worksheet data
      queryClient.invalidateQueries(["employee-sheets", user?.email]);
    },
    onError: (error) => {
      toast.error("Failed to add work data");
      console.error("Error adding sheet:", error);
    },
  });

  // Handle add form submit
  const onSubmit = (data) => {
    const sheetData = {
      hour: parseInt(data.hour),
      task: data.task,
      date: data.date,
      employee_email: user?.email,
      employee_name: user?.name,
    };
    addSheet(sheetData);
  };

  // Handle delete entry with confirmation dialog
  const handleEntryDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This entry will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e11d48", // red-600
      cancelButtonColor: "#6b7280", // gray-500
    });
    if (confirm.isConfirmed) {
      try {
        axiosSecure
          .delete(`/myWorkSheet/${id}`, { withCredentials: true })
          .then((res) => {
            if (res.data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Entry has been deleted.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
              });
            }
            refetch();
          });
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete Entry", "error");
      }
    }
  };

  // Mutation for updating an entry
  const { mutate: updateSheet, isLoading: updating } = useMutation({
    // Send PATCH request to update one entry
    mutationFn: ({ id, updateData }) =>
      axiosSecure.patch(`/workSheet/${id}`, updateData),
    onSuccess: () => {
      toast.success("Work entry updated successfully");
      refetch();
      // Invalidate cache so list refreshes
      queryClient.invalidateQueries(["employee-sheets", user?.email]);
    },
    onError: (error) => {
      toast.error("Failed to update work entry ");
      console.error("Error updating sheet:", error);
    },
  });

  // Open modal and set data for editing
  const openEditModal = (entry) => {
    setEditData(entry);
    setModalOpen(true);
  };

  // Close modal and clear edit data
  const closeModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  // Handle changes in the edit modal form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save in edit modal
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editData) return;
    // Exclude _id from updateData to avoid MongoDB error
    const { _id, ...updateData } = editData;
    updateSheet({ id: _id, updateData });
    closeModal();
  };

  // Table columns configuration
  const columns = [
    {
      accessorKey: "task",
      header: "Task",
    },
    {
      accessorKey: "hour",
      header: "Hours",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "employee_email",
      header: () => (
        <span className="hidden lg:table-cell">Employee Email</span>
      ),
      cell: ({ row }) => (
        <span className="hidden lg:table-cell">
          {row.original.employee_email}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          {/* Edit button */}
          <button
            className="text-blue-600 cursor-pointer"
            title="Edit"
            onClick={() => openEditModal(row.original)}
          >
            <FaPen size={18} />
          </button>
          {/* Delete button */}
          <button
            className="text-red-600 cursor-pointer"
            title="Delete"
            onClick={() => handleEntryDelete(row.original._id)}
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-1 md:p-6">
      <h2 className="text-3xl font-bold mb-6 text-primary">My Work Sheet</h2>

      {/* Add Entry Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end shadow p-4 rounded-lg mb-8"
      >
        {/* Task Select */}
        <div className="md:col-span-2 lg:col-span-1">
          <select
            className={`w-full px-4 py-3 rounded-lg border bg-base-100 ${
              errors.task ? "border-red-500" : "border-primary/20"
            } focus:outline-none focus:border-primary`}
            {...register("task", { required: "Task is required" })}
          >
            <option value="">Select Option</option>
            {TASK_OPTIONS.map((task, idx) => (
              <option key={idx} value={task}>
                {task}
              </option>
            ))}
          </select>
          {errors.task && (
            <p className="text-red-500 text-xs mt-1">{errors.task.message}</p>
          )}
        </div>

        {/* Hours Input */}
        <div className="md:col-span-1 lg:col-span-1">
          <input
            type="number"
            min={1}
            placeholder="Working Hours"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.hour ? "border-red-500" : "border-primary/20"
            } focus:outline-none focus:border-primary`}
            {...register("hour", {
              required: "Hours are required",
              min: { value: 1, message: "Minimum 1 hour" },
            })}
          />
          {errors.hour && (
            <p className="text-red-500 text-xs mt-1">{errors.hour.message}</p>
          )}
        </div>

        {/* Date Input */}
        <div className="md:col-span-1 lg:col-span-1">
          <input
            type="date"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.date ? "border-red-500" : "border-primary/20"
            } focus:outline-none focus:border-primary`}
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-1 lg:col-span-1">
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-secondary-dark py-3 rounded-lg text-white transition-colors cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Data Table for worksheet entries */}
      <DataTable
        columns={columns}
        data={myEntries}
        onEdit={openEditModal}
        onDelete={handleEntryDelete}
      />
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <PaginationList
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-base-100 w-[95vw] max-w-md rounded-lg shadow-lg p-6 relative mx-2">
            <h2 className="text-xl font-bold mb-4 text-primary">Edit Entry</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              {/* Task Select */}
              <div>
                <label className="block mb-1 font-semibold">Task</label>
                <select
                  name="task"
                  value={editData?.task || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2 bg-base-100"
                  required
                >
                  <option value="" disabled>
                    Select Task
                  </option>
                  {TASK_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              {/* Hours Input */}
              <div>
                <label className="block mb-1 font-semibold">Hours</label>
                <input
                  type="number"
                  name="hour"
                  value={editData?.hour || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  min="1"
                  step="0.1"
                  required
                />
              </div>
              {/* Date Input */}
              <div>
                <label className="block mb-1 font-semibold">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editData?.date || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              {/* Employee Email (disabled) */}
              <div>
                <label className="block mb-1 font-semibold">
                  Employee Email
                </label>
                <input
                  type="email"
                  name="employee_email"
                  value={editData?.employee_email || ""}
                  className="w-full border rounded px-3 py-2"
                  disabled
                />
              </div>
              {/* Modal Action Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer px-4 py-2 rounded  font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-4 py-2 rounded bg-primary  font-semibold hover:bg-primary/90"
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkSheet;
