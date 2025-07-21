import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditEmployeeModal = ({
  isOpen,
  onClose,
  employee,
  handleSave,
  saving,
}) => {
  const [formData, setFormData] = useState(employee);

  // Sync with parent when employee changes
  useEffect(() => {
    setFormData(employee);
  }, [employee]);

  if (!isOpen || !employee) return null;

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const { _id, ...updatedData } = formData;
    handleSave({ _id, ...updatedData });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="relative bg-base-100 rounded-xl w-full max-w-lg mx-4 sm:mx-0 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          title="Close"
        >
          <FaTimes size={18} />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold text-primary mb-5 border-b pb-2">
          Edit Employee
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData?.name || ""}
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData?.designation || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter designation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData?.role || "Employee"}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Salary <span className="text-gray-500">(≥ {employee.salary})</span>
            </label>
            <input
              type="number"
              name="salary"
              min={employee.salary}
              value={formData?.salary}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Enter new salary"
            />
          </div>

          <button
            type="submit"
            className="btn bg-primary text-white w-full mt-2 hover:bg-primary/90 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
