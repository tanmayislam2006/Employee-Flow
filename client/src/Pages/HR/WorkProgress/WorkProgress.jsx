/**
 * WorkProgress.jsx
 *
 * HR View: See all employee work logs with server-side filtering
 * - Filters by Employee Name, Month, Year, Search
 * - Responsive filter section
 * - Data loaded from backend with query params
 */

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DataTable from "../../../Components/DataTable/DataTable";
import useAxiosSecure from "../../../Hook/useAxiosSecure";
import Loader from "../../../Components/Loader/Loader";
import WorkSummery from "./WorkSummery";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WorkProgress = () => {
  const axiosSecure = useAxiosSecure();

  // Filter states
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * Query to load filtered data from server
   * React Query automatically refetches when any filter changes
   */
  const {
    data: workSheets = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "workSheets",
      selectedEmployee,
      selectedMonth,
      selectedYear,
      searchTerm,
    ],
    queryFn: async () => {
      // Build query params
      // URLSearchParams is a built-in JavaScript Web API class.
      // It helps construct query strings easily

      const params = new URLSearchParams();
      if (selectedEmployee) params.append("employee", selectedEmployee);
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);
      if (searchTerm) params.append("search", searchTerm);

      const response = await axiosSecure.get(
        `/workSheets?${params.toString()}`
      );
      return response.data;
    },
  });

  /**
   * Collect unique employees and years for dropdowns
   * - Since this data is now filtered server-side, we just map the result
   */
  const employeeOptions = [
    ...new Set(workSheets.map((w) => w.employee_name)),
  ].sort();
  const yearOptions = [
    ...new Set(workSheets.map((w) => new Date(w.date).getFullYear())),
  ].sort();

  /**
   * Define table columns
   */
  const columns = [
    { accessorKey: "employee_name", header: "Name" },
    {
      accessorKey: "employee_email",
      header: () => <span className="hidden lg:table-cell">Email</span>,
      cell: ({ row }) => (
        <span className="hidden lg:table-cell">
          {row.original.employee_email}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: () => <span className="hidden lg:table-cell">Date</span>,
      cell: ({ row }) => (
        <span className="hidden lg:table-cell">
          {new Date(row.original.date).toLocaleDateString()}
        </span>
      ),
    },
    { accessorKey: "task", header: "Task" },
    { accessorKey: "hour", header: "Working Hours" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-primary text-center">
        Employee Work Records
      </h2>
      {/* Chart for selected or searched employee */}
      {(selectedEmployee || searchTerm) && workSheets.length > 0 && (
        <WorkSummery
          data={workSheets}
          employeeName={selectedEmployee || searchTerm}
        />
      )}

      {/* Filter Section */}
      <div className="bg-base-100 border rounded shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        {/* Employee Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Employee</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="select select-bordered w-48"
          >
            <option value="">All Employees</option>
            {employeeOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="select select-bordered w-36"
          >
            <option value="">All Months</option>
            {monthNames.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="select select-bordered w-32"
          >
            <option value="">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            placeholder="Name or Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-48"
          />
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setSelectedEmployee("");
            setSelectedMonth("");
            setSelectedYear("");
            setSearchTerm("");
          }}
          className="btn btn-outline  mt-6"
        >
          Clear Filters
        </button>
      </div>

      {/* Loading / Error / No Data states */}
      {isLoading && <Loader />}
      {isError && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}

      {/* Data Table */}
      {!isLoading && !isError && workSheets.length > 0 ? (
        <DataTable data={workSheets} columns={columns} />
      ) : (
        !isLoading &&
        !isError && (
          <p className="text-center text-gray-500">
            No records match the selected filters.
          </p>
        )
      )}
    </div>
  );
};

export default WorkProgress;
