import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./Routes/router";
import EmployeeFlowProvider from "./Context/EmployeeFlowProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <EmployeeFlowProvider>
      <RouterProvider router={router} />
    </EmployeeFlowProvider>
    <ToastContainer />
  </QueryClientProvider>
);
