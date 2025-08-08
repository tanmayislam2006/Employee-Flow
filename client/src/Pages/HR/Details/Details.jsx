/**
 * Details.jsx
 *
 * Renders a responsive employee payment details page:
 * - Top profile card with employee info
 * - Bottom bar chart with payment history
 *
 * Uses Recharts for visualization
 * Theme-friendly Tailwind / DaisyUI styling
 */

import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useMemo } from "react";
import { useParams } from "react-router";
import { FaUserCircle, FaEnvelope, FaBriefcase } from "react-icons/fa";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import useUserProfile from './../../../Hook/useUserProfile';

// Example theme color palette
const THEME_COLORS = [
  "#2563eb", // blue-600
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#8b5cf6", // purple-500
  "#ef4444", // red-500
  "#14b8a6", // teal-500
  "#6366f1", // indigo-500
];

const Details = () => {
  const { email } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch profile data
  const { data: user, isLoading: loadingUser } = useUserProfile(email);

  // Fetch employee-specific transactions
  const {
    data,
    isLoading: loadingTx,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/transactions/${user?.email}`);
      return res.data;
    },
  });

  // Always default to empty array if data not yet loaded
  const transactions = data?.transactions || [];

  // Memoized chart data
  const chartData = useMemo(() => {
    return transactions.map((tx) => ({
      id: tx._id,
      monthYear: `${tx.pay_for_month} ${tx.pay_for_year}`,
      amount: tx.amount,
    }));
  }, [transactions]);

  // Random color generator (from theme)
  const getRandomColor = () =>
    THEME_COLORS[Math.floor(Math.random() * THEME_COLORS.length)];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Profile Card */}
      {loadingUser ? (
        <p className="text-center text-gray-500">Loading profile...</p>
      ) : user ? (
        <div className="bg-base-100 rounded-lg shadow-lg border border-primary/20 p-6 flex flex-col md:flex-row items-center gap-4">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <FaUserCircle className="w-24 h-24 text-gray-400" />
          )}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary">{user.name}</h2>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope className="text-primary" /> {user.email}
            </p>
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
              <FaBriefcase className="text-primary" /> {user.designation}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                user.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {user.status}
            </span>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No profile data available.</p>
      )}

      {/* Payment History Chart */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          Payment History
        </h2>

        {loadingTx && (
          <p className="text-center text-gray-500">Loading payment history...</p>
        )}
        {isError && (
          <p className="text-center text-red-500">Error: {error.message}</p>
        )}
        {!loadingTx && !isError && !chartData.length && (
          <p className="text-center text-gray-500">
            No payment history available.
          </p>
        )}

        {!loadingTx && !isError && chartData.length > 0 && (
          <div className="bg-base-100 rounded-lg shadow border border-primary/20 p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
                <XAxis
                  dataKey="monthYear"
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
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "bold" }}
                  itemStyle={{ color: "#4b5563" }}
                  formatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="amount"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive
                  fillOpacity={0.9}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getRandomColor()} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
