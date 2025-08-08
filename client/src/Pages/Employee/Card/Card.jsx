import React from "react";
import { FaCalendarAlt, FaHashtag, FaMoneyBillWave } from "react-icons/fa";

const Card = ({ transactions }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {transactions.map((item) => (
        <div
          key={item._id}
          className="bg-base-100 border-2 border-primary/20 rounded-lg shadow p-4 flex flex-col gap-2"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-primary">
              {item.pay_for_month} {item.pay_for_year}
            </h3>
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              Paid
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-base-200 px-2 py-1 rounded">
              <FaMoneyBillWave className="inline mr-1" />
              <strong>Amount:</strong> ${item.amount}
            </span>
            <span className="bg-base-300 px-1 py-1 rounded break-all">
              <FaHashtag className="inline mr-1" />
              <strong>Txn:</strong> {item.transactionId}
            </span>
            <span className="bg-base-200 px-2 py-1 rounded">
              <FaCalendarAlt className="inline mr-1" />
              <strong>Paid At:</strong>{" "}
              {new Date(item.paid_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
