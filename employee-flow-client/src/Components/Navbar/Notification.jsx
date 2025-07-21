import React, { useState } from "react";
import { FaBell } from "react-icons/fa";

const Notification = () => {
  const [open, setOpen] = useState(false);
  
  // Sample static notifications - replace with dynamic in future
  const [notifications] = useState([
    { _id: "1", message: "Your task was approved." },
    { _id: "2", message: "New HR policy available." },
    { _id: "3", message: "Reminder: Complete your profile." },
    { _id: "4", message: "You have a new message." },
  ]);

  return (
    <div className="relative">
      {/* Toggle Button with badge */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-full bg-base-200 hover:bg-base-300 transition"
      >
        <FaBell size={18} className="cursor-pointer" />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto border border-primary/10 bg-base-100 rounded-xl shadow-lg z-50 animate-fade-in"
        >
          <div className="px-4 py-3 border-b border-primary/10 font-bold text-primary">
            Notifications
          </div>
          <ul className="divide-y">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <li
                  key={item._id}
                  className="px-4 py-3  transition cursor-pointer  font-openSans text-sm"
                >
                  {item.message}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center  text-sm">
                No notifications
              </li>
            )}
          </ul>
          <div className="px-4 py-2 text-center text-sm border-t border-primary/10 hover:bg-primary/5 cursor-pointer transition">
            View all
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
