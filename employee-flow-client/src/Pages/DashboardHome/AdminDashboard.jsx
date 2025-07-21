import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaMoneyBillWave, FaCheck, FaClock, FaTimes } from "react-icons/fa";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { format } from "date-fns";
import useAxiosSecure from './../../Hook/useAxiosSecure';

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1", "#ec4899"];

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/adminDashboardSummary");
      return res.data;
    },
  });

  const chartData = (data?.paidRequestsPerMonth || []).map(item => ({
    month: `${item._id.month} ${item._id.year}`,
    amount: item.total,
    count: item.count,
  }));

  const pieData = [
    { name: "Paid", value: data?.totalPaid || 0 },
    { name: "Pending", value: data?.totalPending || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h2>

      {isLoading && <p className="text-center text-gray-500">Loading...</p>}
      {isError && <p className="text-center text-red-500">Error: {error.message}</p>}

      {!isLoading && !isError && data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <SummaryCard
              title="Total Requests"
              value={data.totalRequests}
              icon={<FaClock className="text-primary text-3xl mb-2 mx-auto" />}
            />
            <SummaryCard
              title="Paid Requests"
              value={data.totalPaid}
              icon={<FaCheck className="text-green-600 text-3xl mb-2 mx-auto" />}
            />
            <SummaryCard
              title="Pending Requests"
              value={data.totalPending}
              icon={<FaTimes className="text-yellow-500 text-3xl mb-2 mx-auto" />}
            />
            <SummaryCard
              title="Total Money Spent"
              value={`$${data.totalMoneySpent}`}
              icon={<FaMoneyBillWave className="text-blue-500 text-3xl mb-2 mx-auto" />}
            />
          </div>

          {/* Spending Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 *:border">
            <BreakdownCard title="Today" value={`$${data.todaySpent}`} />
            <BreakdownCard title="This Week" value={`$${data.weekSpent}`} />
            <BreakdownCard title="This Month" value={`$${data.monthSpent}`} />
            <BreakdownCard title="This Year" value={`$${data.yearSpent}`} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Line Chart: Spending Trend */}
            <div className="border  rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-4 text-primary">Spending Trend Over Time</h3>
              {chartData.length === 0 ? (
                <p className="text-center text-gray-500">No data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Pie Chart: Paid vs Pending */}
            <div className="border  rounded-lg shadow p-4">
              <h3 className="text-lg font-bold mb-4 text-primary">Paid vs Pending Requests</h3>
              {pieData.every(d => d.value === 0) ? (
                <p className="text-center text-gray-500">No data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      label
                      outerRadius={100}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Latest Transactions Table */}
          <div className="border  rounded-lg shadow p-4">
            <h3 className="text-lg font-bold mb-4 text-primary">Latest Transactions</h3>
            {data.latestTransactions.length === 0 ? (
              <p className="text-center text-gray-500">No recent transactions found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-fit md:min-w-full text-left">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-2">Employee</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Paid At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.latestTransactions.map((txn, idx) => (
                      <tr key={idx} className="border-b hover:bg-base-200 transition">
                        <td className="p-2">{txn.employeeName}</td>
                        <td className="p-2 text-green-700 font-bold">${txn.amount}</td>
                        <td className="p-2">{format(new Date(txn.paid_at), "PPpp")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/* ✅ Small components for clarity */

const SummaryCard = ({ title, value, icon }) => (
  <div className="border  rounded-lg shadow p-4 text-center">
    {icon}
    <div className="text-xl font-bold">{value}</div>
    <div className="text-gray-500 text-sm">{title}</div>
  </div>
);

const BreakdownCard = ({ title, value }) => (
  <div className="bg-base-100 rounded-lg shadow p-4 text-center">
    <div className="text-lg font-semibold text-primary">{title}</div>
    <div className="text-green-600 text-xl font-bold">{value}</div>
  </div>
);

export default AdminDashboard;
