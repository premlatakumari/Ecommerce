import express from "express";
import {
  getAllUsers,
  updateUserStatus,
  getDashboardStats,
  getUserProfile
} from "../controllers/dashboard.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes
router.get("/admin/users", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.patch("/admin/users/:userId/status", isAuthenticated, isAuthorized("Admin"), updateUserStatus);
router.get("/admin/stats", isAuthenticated, isAuthorized("Admin"), getDashboardStats);
router.get("/admin/profile", isAuthenticated, isAuthorized("Admin"), getUserProfile);

// User routes
router.get("/user/profile", isAuthenticated, getUserProfile);

export default router;