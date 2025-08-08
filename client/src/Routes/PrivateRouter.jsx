import { Navigate, useLocation } from "react-router";
import useAuthProvidor from "../Hook/useAuthProvidor";
import Loader from "../Components/Loader/Loader";

const PrivateRouter = ({ children }) => {
  const { firebaseUser, loading } = useAuthProvidor();
  const location = useLocation();

  if (loading) {
    return <Loader />;
  }

  if (!firebaseUser) {
    return <Navigate to="/login" state={location.pathname}/>;
  }

  return children;
};

export default PrivateRouter;
