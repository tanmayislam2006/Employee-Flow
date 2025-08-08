import { useState } from "react";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuthProvidor from "../../../Hook/useAuthProvidor";

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const PayModal = ({ isOpen, onClose, handlePaySubmit, employee }) => {
  const axiosSecure = useAxiosSecure();
  const {user}=useAuthProvidor();

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Load existing pay requests when modal opens
const {
  data,
} = useQuery({
  enabled: isOpen && !!employee?.email,
  queryKey: ["payRequests", employee?.email],
  queryFn: async () => {
    const res = await axiosSecure.get(`/payRolls?employeeEmail=${employee.email}`);
    return res.data;
  },
});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!month || !year) {
      setErrorMessage("Please select both Month and Year.");
      return;
    }

    // Check for duplicates
    const duplicate = data?.payRolls.find(
      (req) => req.month === month && req.year === year
    );

    if (duplicate) {
      setErrorMessage(
        `You have already requested payment for ${month} ${year}.`
      );
      return;
    }

    // All good → submit
    handlePaySubmit({
      employeeId: employee._id,
      salary: employee.salary,
      month,
      year,
      employeeName: employee.name,
      employeeEmail: employee.email,
      hrEmail: user.email,
      hrName: user.name,
    });

    // Reset
    setMonth("");
    setYear("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-base-200 w-[95vw] max-w-md rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4 text-primary">Pay Employee</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Employee</label>
            <input
              type="text"
              value={employee.name}
              disabled
              className="w-full border rounded px-3 py-2 bg-base-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Salary</label>
            <input
              type="number"
              value={employee.salary}
              disabled
              className="w-full border rounded px-3 py-2 bg-base-100"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Month</label>
            <select
              name="month"
              id="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="w-full border rounded p-2 bg-base-100"
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Year</label>
            <input
              type="number"
              placeholder="e.g., 2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <p className="text-red-500 text-sm">
            Note: You can only pay for one month at a time.
          </p>
          {errorMessage && (
            <p className="text-red-600 font-medium">{errorMessage}</p>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setMonth("");
                setYear("");
                setErrorMessage("");
                onClose();
              }}
              className="cursor-pointer px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/90"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PayModal;
