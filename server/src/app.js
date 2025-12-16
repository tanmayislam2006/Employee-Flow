import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./modules/auth/auth.route.js";
import { EmployeeRoutes } from "./modules/Employee/employee.route.js";
import { HRRoutes } from "./modules/HR/hr.route.js";
import { AdminRoutes } from "./modules/Admin/admin.route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://employee-flow-app.web.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Employee Flow Server Is Running");
});

// Module Routes
app.use("/", AuthRoutes);
app.use("/", EmployeeRoutes);
app.use("/", HRRoutes);
app.use("/", AdminRoutes);

export default app;
