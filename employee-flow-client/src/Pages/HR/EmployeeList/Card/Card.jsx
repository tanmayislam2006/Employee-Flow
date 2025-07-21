import React from "react";
import { FaCheckCircle, FaDollarSign, FaTimesCircle, FaUniversity,FaEye } from "react-icons/fa";
import Loader from "../../../../Components/Loader/Loader";

const Card = ({ employees, isLoading, handleVerify, openPayModal, navigate }) => {
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
      {isLoading ? (
       <Loader/>
      ) : employees.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No employees found.</p>
      ) : (
        employees.map((emp) => (
          <div
            key={emp._id}
            className="bg-base-100 rounded-lg shadow p-4 flex flex-col gap-2 border border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-primary">{emp.name}</span>
              {emp.isVerified ? (
                <FaCheckCircle
                  className="text-green-500 cursor-pointer"
                  title="Click to unverify"
                  onClick={() => handleVerify(emp)}
                />
              ) : (
                <FaTimesCircle
                  className="text-red-500 cursor-pointer"
                  title="Click to verify"
                  onClick={() => handleVerify(emp)}
                />
              )}
            </div>
            <div className="text-sm break-all">
              <span className="font-semibold">Email:</span> {emp.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FaUniversity className="text-blue-500" />
              <span>{emp.bank_account || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <FaDollarSign /> {emp.salary || 0}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openPayModal(emp)}
                className={`bg-primary text-white px-3 py-2 rounded text-xs font-medium flex-1 cursor-pointer ${
                  !emp.isVerified ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!emp.isVerified}
              >
                Pay
              </button>
              <button
                onClick={() => navigate(`/dashboard/details/${emp.email}`)}
                className="text-blue-600 hover:underline flex items-center gap-1 text-xs flex-1 justify-center cursor-pointer btn"
              >
                <FaEye /> View
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
