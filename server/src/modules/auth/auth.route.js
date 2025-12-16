import express from "express";
import { AuthController } from "./auth.controller.js";

const router = express.Router();

// Routes mapped from original index.js
router.post("/register", AuthController.register);
router.get("/user/:email", AuthController.getUser);
router.get("/user/email/:email", AuthController.getStatus);
router.patch("/login", AuthController.loginUpdate);

export const AuthRoutes = router;
