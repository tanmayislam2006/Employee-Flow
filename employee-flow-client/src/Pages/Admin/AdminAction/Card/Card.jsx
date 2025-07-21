import React from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../../../Components/Loader/Loader";

const Card = ({
  isLoading,
  isError,
  error,
  verifiedUsers,
  openModal,
  handleToggleStatus,
  toggling,
}) => {
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : verifiedUsers.length === 0 ? (
        <p className="text-center text-gray-500">
          No verified employees found.
        </p>
      ) : (
        verifiedUsers.map((emp) => (
          <div
            key={emp._id}
            className="bg-base-200 rounded-lg shadow p-4 flex flex-col gap-3 border border-primary/20"
          >
            <div className="flex items-center gap-4">
              <img
                src={emp.profileImage}
                alt={emp.name}
                className="w-14 h-14 rounded-full object-cover border"
              />
              <div>
                <div className="text-lg font-bold text-primary">{emp.name}</div>
                <div className="text-sm text-gray-500 break-all">
                  {emp.email}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-sm mt-2">
              <span className=" px-2 py-1 rounded-2xl">
                <strong>Designation:</strong> {emp.designation || "N/A"}
              </span>
              <span className=" px-2 py-1 rounded-2xl capitalize">
                <strong>Role:</strong> {emp.role}
              </span>
              <span
                className={`px-2 py-1 rounded-2xl text-xs ${
                  emp.status === "Fired"
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {emp.status || "Active"}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => openModal(emp)}
                className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-2 text-xs hover:bg-blue-600 cursor-pointer"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleToggleStatus(emp)}
                className={`px-3 py-2 rounded flex items-center gap-2 text-xs cursor-pointer ${
                  emp.status === "Fired"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                disabled={toggling}
              >
                {emp.status === "Fired" ? <FaCheck /> : <FaTrash />}
                {emp.status === "Fired" ? "Re-Activate" : "Fire"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
