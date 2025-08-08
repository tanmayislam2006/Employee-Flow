import React from "react";
import { FaCalendarAlt, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import Loader from "../../../../Components/Loader/Loader";

const Card = ({ isLoading, isError, error, payHistory }) => {
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
      {isLoading ? (
       <Loader/>
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : payHistory.length === 0 ? (
        <p className="text-center text-gray-500">No payment records found.</p>
      ) : (
        payHistory.map((row) => (
          <div
            key={row._id}
            className="bg-base-100 border-2 border-primary/20 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-primary">
                {row.employeeName}
              </h3>
              <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
                <FaCheckCircle /> Paid
              </span>
            </div>

            <div className="text-sm text-gray-500 break-all">
              <strong>Email:</strong> {row.employeeEmail}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="bg-base-200 px-2 py-1 rounded">
                <FaMoneyBillWave className="inline mr-1" />
                <strong>Salary:</strong> ${row.amount}
              </span>
              <span className="bg-base-200 px-2 py-1 rounded">
                <strong>Month:</strong> {row.pay_for_month}
              </span>
              <span className="bg-base-200 px-2 py-1 rounded">
                <strong>Year:</strong> {row.pay_for_year}
              </span>
              <span className="bg-base-300 px-2 py-1 rounded break-all">
                <strong>Txn:</strong> {row.transactionId}
              </span>
              <span className="bg-base-300 px-2 py-1 rounded">
                <FaCalendarAlt className="inline mr-1" />
                <strong>Paid:</strong> {new Date(row.paid_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
