import React from "react";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import Forbidden from "./../../Components/Forbidden/Forbidden";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import HrDashboard from "./HrDashboard";

const DashboardHome = () => {
  const { user } = useAuthProvidor();
  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }
  const role = user?.role;
  if (role === "Admin") {
    return <AdminDashboard />;
  } else if (role === "Employee") {
    return <EmployeeDashboard />;
  } else if (role === "HR") {
    return <HrDashboard />;
  } else {
    return <Forbidden />;
  }
};

export default DashboardHome;
