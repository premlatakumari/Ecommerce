import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  validateResetToken,
  resetPassword,
  updatePassword,
  resendOTP,
  uploadAvatar,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

// Public Routes
router.post("/register", (req, res, next) => {
  uploadAvatar.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File size too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only images are allowed.' });
    }
    next();
  });
}, register);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/password/forgot", forgotPassword);
router.get("/password/validate/:token", validateResetToken);
router.put("/password/reset/:token", resetPassword);

// Protected routes
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.put("/password/update", isAuthenticated, updatePassword);

export default router;