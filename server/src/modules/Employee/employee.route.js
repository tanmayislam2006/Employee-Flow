import express from "express";
import { EmployeeController } from "./employee.controller.js";

const router = express.Router();

// Routes mapped from original index.js
router.post("/workSheet", EmployeeController.createWorkSheet);
router.get("/myWorkSheet/:email", EmployeeController.getMyWorkSheets);
router.delete("/myWorkSheet/:id", EmployeeController.deleteWorkSheet);
router.patch("/workSheet/:id", EmployeeController.updateWorkSheet);
router.get("/dashboard-employee/:email", EmployeeController.getDashboardData);
router.get("/transactions/:email", EmployeeController.getTransactions);
router.post("/payRoll", EmployeeController.requestPayRoll);

export const EmployeeRoutes = router;
