import express from "express";
import { AdminController } from "./admin.controller.js";

const router = express.Router();

// Routes mapped from original index.js
router.get("/payRolls", AdminController.getPayRolls);
router.get("/payRoll/:id", AdminController.getPayRoll);
router.patch("/payRoll/:id", AdminController.updatePayRoll);
router.delete("/payRoll/:id", AdminController.deletePayRoll);
router.post("/create-payment-intent", AdminController.paymentIntent);

router.get("/transactions", AdminController.getTransactions);
router.post("/transaction", AdminController.createTransaction);

router.get("/contacts", AdminController.getContacts);
router.post("/contact", AdminController.createContact);

router.patch("/user/:id", AdminController.updateUser);
router.get("/adminDashboardSummary", AdminController.getDashboardSummary);

export const AdminRoutes = router;
