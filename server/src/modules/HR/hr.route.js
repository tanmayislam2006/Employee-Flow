import express from "express";
import { HRController } from "./hr.controller.js";

const router = express.Router();

// Routes mapped from original index.js
router.get("/workSheets", HRController.getWorkSheets);
router.get("/users", HRController.getUsers);
router.patch("/user/:id/verify", HRController.verifyUser);
router.get("/hrDashboardSummary/:hrEmail", HRController.getDashboardSummary);

export const HRRoutes = router;
