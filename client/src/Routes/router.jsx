import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";
import Contact from "../Pages/Contact/Contact";
import About from "../Pages/About/About";
import AuthnticationLayout from "../Layout/AuthnticationLayout";
import Login from "./../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";
import DashboardLayout from "../Layout/DashboardLayout";
import PrivateRouter from "./PrivateRouter";
import WorkSheet from "./../Pages/Employee/WorkSheet";
import EmployeeList from "../Pages/HR/EmployeeList/EmployeeList";
import WorkProgress from "../Pages/HR/WorkProgress/WorkProgress";
import AdminAction from "../Pages/Admin/AdminAction/AdminAction";
import PaySheets from "../Pages/Admin/PaySheets/PaySheets";
import UserProfile from "../Pages/UserProfile/UserProfile";
import Payment from "../Pages/Admin/Payment/Payment";
import PayRequest from "../Pages/HR/PayRequest/PayRequest";
import PayHistory from "../Pages/Admin/PayHistory/PayHistory";
import SalaryInfo from "../Pages/Employee/SalaryInfo";
import Details from "../Pages/HR/Details/Details";
import Contacts from "../Pages/Admin/Contacts/Contacts";
import Error from "../Pages/Error/Error";
import Forbidden from './../Components/Forbidden/Forbidden';
import HrRouter from "./HrRouter";
import AdminRouter from "./AdminRouter";
import DashboardHome from "../Pages/DashboardHome/DashboardHome";

const router = createBrowserRouter([
  // mainlayout
  {
    path: "/",
    Component: MainLayout,
    errorElement:<Error/>,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/about",
        Component: About,
      },
    ],
  },
  // authentication layout
  {
    path: "/",
    Component: AuthnticationLayout,
    errorElement:<Error/>,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/forbidden",
    Component: Forbidden,
  },
  // dashboard layout
  {
    path: "/dashboard",

    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    errorElement:<Error/>,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "profile",
        element: <UserProfile />,
      },
      {
        path: "workSheets",
        element: <WorkSheet />,
      },
      {
        path: "salaryInfo",
        element: <SalaryInfo />,
      },
      // hr route
      {
        path: "employeeList",
        element: <HrRouter><EmployeeList /></HrRouter>,
      },
      {
        path: "employeeWorkSheets",
        element: <HrRouter><WorkProgress /></HrRouter>,
      },
      {
        path: "payRequest",
        element: (
          <HrRouter><PayRequest /></HrRouter>
        ),
      },
      {
        path: "details/:email",
        element: (
          <HrRouter><Details /></HrRouter>
        ),
      },
      // admin route
      {
        path: "adminAction",
        element: <AdminRouter><AdminAction /></AdminRouter>,
      },
      {
        path: "paySheets",
        element: <AdminRouter><PaySheets /></AdminRouter>,
      },
      {
        path: "payment/:id",
        element: <AdminRouter><Payment /></AdminRouter>,
      },
      {
        path: "payHistory",
        element: <AdminRouter><PayHistory /></AdminRouter>,
      },
      {
        path: "contacts",
        element: <AdminRouter><Contacts /></AdminRouter>,
      }
    ],
  },
]);
export default router;
