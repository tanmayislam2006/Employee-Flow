import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import Loader from "../Components/Loader/Loader";
import useAuthProvidor from "../Hook/useAuthProvidor";
import EmployeeFlow from "../Components/EmployeeFlow/EmployeeFlow";
import {
  FaClipboardList,
  FaDollarSign,
  FaHistory,
  FaHome,
  FaMoneyBillWave,
  FaPhone,
  FaPlus,
  FaRegListAlt,
  FaSignOutAlt,
  FaTools,
  FaUser,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { MdRequestQuote } from "react-icons/md";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutUser, loading, user } = useAuthProvidor();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
  };

  if (loading) {
    return <Loader />;
  }

  const role = user?.role || "";

  // All links with allowed roles
  const allLinks = [
    { to: "/dashboard", label: "Home", icon: <FaHome />, roles: ["Employee", "HR", "Admin"] },
    { to: "/dashboard/profile", label: "My Profile", icon: <FaUser />, roles: ["Employee", "HR", "Admin"] },
    { to: "/dashboard/workSheets", label: "My Work", icon: <FaPlus />, roles: ["Employee"] },
    { to: "/dashboard/salaryInfo", label: "Salary Info", icon: <FaMoneyBillWave />, roles: ["Employee"] },
    { to: "/dashboard/employeeList", label: "Employee List", icon: <FaClipboardList />, roles: ["HR"] },
    { to: "/dashboard/employeeWorkSheets", label: "Working Progress", icon: <FaRegListAlt />, roles: ["HR"] },
    { to: "/dashboard/payRequest", label: "Pay Request", icon: <MdRequestQuote />, roles: ["HR"] },
    { to: "/dashboard/adminAction", label: "Admin Action", icon: <FaTools />, roles: ["Admin"] },
    { to: "/dashboard/paySheets", label: "Pay Sheets", icon: <FaDollarSign />, roles: ["Admin"] },
    { to: "/dashboard/payHistory", label: "Pay History", icon: <FaHistory />, roles: ["Admin"] },
    { to: "/dashboard/contacts", label: "Contacts", icon: <FaPhone />, roles: ["Admin"] },
  ];

  // Filter links by user role
  const filteredLinks = allLinks.filter(link => link.roles.includes(role));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <EmployeeFlow />
          {/* Always show close button on sidebar */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn rounded-full flex items-center justify-center bg-transparent hover:bg-primary/10"
            aria-label="Close Sidebar"
          >
            <FiX className="text-neutral" size={30} />
          </button>
        </div>
        <nav className="flex flex-col mt-4">
          {filteredLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center px-4 py-3 text-sm font-medium hover:bg-primary/10 dark:hover:bg-primary/20 ${
                location.pathname === link.to
                  ? "text-primary font-bold"
                  : "text-neutral"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">{link.icon}</span> {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="cursor-pointer flex items-center px-4 py-3 text-sm font-medium text-red-500 mt-auto"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Topbar / Mobile Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-base-100 shadow">
          {/* Always show open button on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open Sidebar"
          >
            <FiMenu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-primary">Dashboard</h2>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
