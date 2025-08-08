import React from "react";
import { FaInfoCircle, FaTrash } from "react-icons/fa";
import Loader from "../../../../Components/Loader/Loader";

const Card = ({ isLoading, isError, error, payRolls, handleDelete, deleting }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : payRolls.length === 0 ? (
        <p className="text-center text-gray-500">No payroll entries found.</p>
      ) : (
        payRolls.map((row) => (
          <div
            key={row._id}
            className="bg-base-100 border-2 border-primary/30 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-primary">
                {row.employeeName}
              </span>
              <div className="flex gap-2 items-center">
                <button
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="View Info"
                  onClick={() =>
                    alert(
                      `Request At: ${new Date(
                        row.payrequest_at
                      ).toLocaleString()}`
                    )
                  }
                >
                  <FaInfoCircle size={18} />
                </button>
                {row.status === "pending" && (
                  <button
                    className="text-red-600 hover:text-red-800 cursor-pointer disabled:opacity-50"
                    title="Delete Request"
                    onClick={() => handleDelete(row._id)}
                    disabled={deleting}
                  >
                    <FaTrash size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="text-sm text-gray-400 break-all">
              <span className="font-semibold">Email:</span> {row.employeeEmail}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-2 py-1 rounded">
                <strong>Salary:</strong> ${row.salary}
              </span>
              <span className="px-2 py-1 rounded">
                <strong>Month:</strong>{" "}
                <span className="font-mono">{row.month}</span>
              </span>
              <span className="px-2 py-1 rounded">
                <strong>Year:</strong> {row.year}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  row.status === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {row.status === "paid" ? "Paid" : "Pending"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
