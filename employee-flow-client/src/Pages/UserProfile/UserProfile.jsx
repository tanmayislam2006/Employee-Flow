import React from "react";
import {
  MdEmail,
  MdWork,
  MdAssignmentInd,
  MdAttachMoney,
  MdAccountBalance,
  MdVerified,
  MdSchedule,
  MdPerson,
} from "react-icons/md";
import useAuthProvidor from "../../Hook/useAuthProvidor";

const UserProfile = () => {
    const {user}=useAuthProvidor()
  if (!user) {
    return (
      <div className="p-4 text-center text-gray-500">
        No user data available.
      </div>
    );
  }

  // Convert creationTime and lastSignInTime to local string
  const formattedCreationTime = user.creationTime
    ? new Date(user.creationTime).toLocaleString()
    : "N/A";

  const formattedLastSignInTime = user.lastSignInTime
    ? new Date(user.lastSignInTime).toLocaleString()
    : "N/A";

  return (
    <div className="max-w-3xl mx-auto md:p-4 lg:p-6">
      <div className="bg-base-100 rounded-lg shadow border">
        {/* Header with Image */}
        <div className="flex flex-col items-center p-6 bg-base-200 rounded-t-lg">
          <img
            src={user.profileImage}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-base-300 shadow"
          />
          <h2 className="text-2xl font-bold mt-3 text-primary flex items-center gap-2">
            <MdPerson /> {user.name}
          </h2>
          <p className="text-gray-500 text-sm break-all flex items-center gap-1">
            <MdEmail /> {user.email}
          </p>
          <span
            className={`mt-2 px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
              user.status === "Fired"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {user.status || "Active"}
          </span>
        </div>

        {/* Details Grid */}
        <div className="p-6 bg-base-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdWork className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">Designation</h4>
              <p className="text-gray-700">{user.designation || "N/A"}</p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdAssignmentInd className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">Role</h4>
              <p className="text-gray-700 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdAttachMoney className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">Salary</h4>
              <p className="text-gray-700">${user.salary}</p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdAccountBalance className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">Bank Account</h4>
              <p className="text-gray-700 break-all">{user.bank_account}</p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdVerified
              className={user.isVerified ? "text-green-500" : "text-red-500"}
              size={20}
            />
            <div>
              <h4 className="text-sm font-semibold text-primary">Verified</h4>
              <p className="text-gray-700">
                {user.isVerified ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2">
            <MdAssignmentInd
              className={
                user.status === "Fired" ? "text-red-500" : "text-green-500"
              }
              size={20}
            />
            <div>
              <h4 className="text-sm font-semibold text-primary">Status</h4>
              <p
                className={
                  user.status === "Fired" ? "text-red-600" : "text-green-600"
                }
              >
                {user.status || "Active"}
              </p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2 col-span-1 sm:col-span-2">
            <MdSchedule className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">Created At</h4>
              <p className="text-gray-700">{formattedCreationTime}</p>
            </div>
          </div>

          <div className="bg-base-200 rounded p-3 flex items-center gap-2 col-span-1 sm:col-span-2">
            <MdSchedule className="text-primary" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-primary">
                Last Sign In
              </h4>
              <p className="text-gray-700">{formattedLastSignInTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
