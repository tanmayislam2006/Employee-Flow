import React from "react";

import { Navigate } from "react-router";
import useAuthProvidor from './../Hook/useAuthProvidor';
import Loader from "../Components/Loader/Loader";

const AdminRouter = ({ children }) => {
  const { user, loading } =useAuthProvidor();
  console.log(user.role);
  if (loading) {
    return <Loader/>;
  }
  if (!user || user?.role !== "Admin") {
    return <Navigate to={"/forbidden"}  />;
  }
  return children;
};

export default AdminRouter;
