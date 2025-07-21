import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import {
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";
import DataTable from "../../Components/DataTable/DataTable";

const HrDashboard = () => {
    const { user } = useAuthProvidor();
  const hrEmail = user?.email;
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hrDashboardSummary", hrEmail],
    enabled: !!hrEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/hrDashboardSummary/${hrEmail}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading dashboard...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!data) {
    return <p className="text-center text-gray-500">No data available.</p>;
  }
const columns = [
    {
        header: "Employee Name",
        accessorKey: "employeeName",
    },
    {
        header: "Email",
        accessorKey: "employeeEmail",
    },
    {
        header: "Month",
        accessorKey: "month",
    },
    {
        header: "Year",
        accessorKey: "year",
        cell: ({ row }) => (
          <span className="hidden lg:table-cell">{row.original.year}</span>
        ),
    },
    {
        header: "Salary",
        accessorKey: "salary",
        cell: ({ row }) => <span>${row.original.salary}</span>,
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              row.original.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </span>
        ),
    },
    {
        header: "Requested At",
        accessorKey: "payrequest_at",
        cell: ({ row }) =>
          new Date(row.original.payrequest_at).toLocaleString(),
    },
]
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-2">
        <FaUsers /> HR Dashboard
      </h2>

      {/* ✅ 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className=" shadow rounded-lg p-4 flex flex-col items-center">
          <FaUsers className="text-primary text-3xl mb-2" />
          <div className="text-2xl font-bold">{data.totalRequests}</div>
          <div className="text-gray-500 text-sm">Total Requests</div>
        </div>
        <div className=" shadow rounded-lg p-4 flex flex-col items-center">
          <FaCheckCircle className="text-green-600 text-3xl mb-2" />
          <div className="text-2xl font-bold">{data.totalPaid}</div>
          <div className="text-gray-500 text-sm">Paid Requests</div>
        </div>
        <div className=" shadow rounded-lg p-4 flex flex-col items-center">
          <FaClock className="text-yellow-500 text-3xl mb-2" />
          <div className="text-2xl font-bold">{data.totalPending}</div>
          <div className="text-gray-500 text-sm">Pending Requests</div>
        </div>
        <div className=" shadow rounded-lg p-4 flex flex-col items-center">
          <FaMoneyBillWave className="text-green-700 text-3xl mb-2" />
          <div className="text-2xl font-bold">${data.paidTotalSalary}</div>
          <div className="text-gray-500 text-sm">Total Paid Amount</div>
        </div>
      </div>

      {/* ✅ 2. Time Stats */}
      <div className="shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Request Counts by Period</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:border *:border-secondary/50">
          <div className="bg-base-100 rounded-lg p-4 flex flex-col items-center">
            <FaCalendarDay className="text-primary text-2xl mb-2" />
            <div className="text-lg font-bold">{data.todayRequests}</div>
            <div className="text-gray-500 text-sm">Today</div>
          </div>
          <div className="bg-base-100 rounded-lg p-4 flex flex-col items-center">
            <FaCalendarWeek className="text-primary text-2xl mb-2" />
            <div className="text-lg font-bold">{data.weeklyRequests}</div>
            <div className="text-gray-500 text-sm">This Week</div>
          </div>
          <div className="bg-base-100 rounded-lg p-4 flex flex-col items-center">
            <FaCalendarAlt className="text-primary text-2xl mb-2" />
            <div className="text-lg font-bold">{data.monthlyRequests}</div>
            <div className="text-gray-500 text-sm">This Month</div>
          </div>
          <div className="bg-base-100 rounded-lg p-4 flex flex-col items-center">
            <FaCalendarAlt className="text-primary text-2xl mb-2" />
            <div className="text-lg font-bold">{data.yearlyRequests}</div>
            <div className="text-gray-500 text-sm">This Year</div>
          </div>
        </div>
      </div>

      {/* ✅ 3. Latest Requests Table */}
      <div className=" shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-primary mb-4">Latest Pay Requests</h3>
        {data.latestRequests.length === 0 ? (
          <p className="text-gray-500">No recent requests found.</p>
        ) : (
          <DataTable columns={columns} data={data.latestRequests} />
        )}
      </div>
    </div>
  );
};

export default HrDashboard;
