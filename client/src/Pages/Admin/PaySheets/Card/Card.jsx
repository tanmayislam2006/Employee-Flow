import React from "react";
import Loader from "../../../../Components/Loader/Loader";

const Card = ({ isLoading, isError, error, payRolls, navigate }) => {
  return (
    <div className="grid grid-cols-1  lg:grid-cols-3 gap-4">
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-center text-red-500">Error: {error.message}</p>
      ) : payRolls.length === 0 ? (
        <p className="text-center text-gray-500">No payroll entries found.</p>
      ) : (
        payRolls.map((payRoll) => (
          <div
            key={payRoll._id}
            className="border border-primary/20 rounded-xl shadow-sm hover:shadow-lg transition-shadow bg-base-100 p-6 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {payRoll.employeeName}
              </h3>

            </div>

            <div className="text-lg font-semibold ">
              ${payRoll.salary.toLocaleString()}
            </div>

            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-gray-500">
                Month: {payRoll.month}
              </span>
              <span className="text-gray-500">
                Year: {payRoll.year}
              </span>
            </div>

            <button
              className=" cursor-pointer mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition"
              onClick={() => navigate(`/dashboard/payment/${payRoll._id}`)}
            >
              Pay Now
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Card;
