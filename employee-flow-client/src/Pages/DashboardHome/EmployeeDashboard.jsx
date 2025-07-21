import React from "react";
import {
  FaClock,
  FaTasks,
  FaMoneyBillWave,
  FaCalendarCheck
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import useAxiosSecure from "../../Hook/useAxiosSecure";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

// Nice color palette for charts
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const EmployeeDashboard = () => {
  const { user } = useAuthProvidor();
  const axiosSecure = useAxiosSecure();

  // Fetch employee dashboard data
  const { data = {
    totalHours: 0,
    workByTask: [],
    totalPaid: 0,
    lastPaidDate: null,
    payments: []
  } } = useQuery({
    queryKey: ['employeeData', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const response = await axiosSecure.get(`/dashboard-employee/${user.email}`);
      return response.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-primary">Employee Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-base-100 border border-primary/20 rounded-xl shadow p-4 flex flex-col items-center">
          <FaClock className="text-primary text-4xl mb-2" />
          <div className="text-2xl font-bold">{data.totalHours}</div>
          <div className="text-gray-500 text-sm">Total Hours Worked</div>
        </div>
        <div className="bg-base-100 border border-secondary/50 rounded-xl shadow p-4 flex flex-col items-center">
          <FaTasks className="text-secondary text-4xl mb-2" />
          <div className="text-2xl font-bold ">{data.workByTask.length}</div>
          <div className="text-gray-500 text-sm">Task Types</div>
        </div>
        <div className="bg-base-100 border border-green-200 rounded-xl shadow p-4 flex flex-col items-center">
          <FaMoneyBillWave className="text-green-600 text-4xl mb-2" />
          <div className="text-2xl font-bold">${data.totalPaid}</div>
          <div className="text-gray-500 text-sm">Total Paid</div>
        </div>
        <div className="bg-base-100 border border-blue-200 rounded-xl shadow p-4 flex flex-col items-center">
          <FaCalendarCheck className="text-blue-500 text-4xl mb-2" />
          <div className="text-lg font-bold">
            {data.lastPaidDate
              ? new Date(data.lastPaidDate).toLocaleDateString()
              : "N/A"}
          </div>
          <div className="text-gray-500 text-sm">Last Paid Date</div>
        </div>
      </div>

      {/* Work By Task Pie Chart */}
      <div className="bg-base-100 border border-primary/20 rounded-xl shadow p-4 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <FaTasks /> Work By Task
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.workByTask}
              dataKey="totalHours"
              nameKey="task"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {data.workByTask.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments Bar Chart */}
      <div className="bg-base-100 border border-primary/20 rounded-xl shadow p-4 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
          <FaMoneyBillWave /> Recent Payments
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data.payments}
            margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
          >
            <CartesianGrid  />
            <XAxis
              dataKey={(d) => `${d.pay_for_month} ${d.pay_for_year}`}
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Amount ($)",
                angle: -90,
                position: "insideLeft",
                fill: "#374151",
                fontSize: 14,
              }}
            />
            <Tooltip
              formatter={(value) => `$${value}`}
              contentStyle={{
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
              }}
              labelStyle={{ color: "#374151", fontWeight: "bold" }}
            />
            <Bar dataKey="amount" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
