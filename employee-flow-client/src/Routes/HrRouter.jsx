import React from "react";

import { Navigate } from "react-router";
import useAuthProvidor from "../Hook/useAuthProvidor";
import Loader from "../Components/Loader/Loader";

const HrRouter = ({ children }) => {
  const { user, loading } = useAuthProvidor();
  if (loading) {
    return <Loader />;
  }
  if (!user || user?.role !== "HR") {
    return <Navigate to={"/forbidden"} />;
  }
  return children;
};

export default HrRouter;
