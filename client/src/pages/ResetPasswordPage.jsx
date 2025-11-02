// src/pages/ResetPasswordPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import {
  Lock,
  Eye,
  EyeOff,
  ShoppingBag,
  Shield,
  ArrowLeft,
} from "lucide-react";

function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      setCheckingToken(false);
      return;
    }

    // Validate token on component mount
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      await authService.validateResetToken(token);
      setTokenValid(true);
    } catch (err) {
      toast.error("This reset link is invalid or has expired");
      setTokenValid(false);
    } finally {
      setCheckingToken(false);
    }
  };

  const handleChange = (e) => {
    setPasswords((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword(
        token,
        passwords.newPassword,
        passwords.confirmNewPassword
      );

      if (result.success) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (err) {
      console.error("Reset Password Error:", err);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
              <Shield className="h-6 w-6 text-emerald-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Validating Reset Link
            </h2>
            <p className="text-slate-600">
              Please wait while we validate your reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-slate-600 mb-6">
              This reset link is invalid or has expired.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/forgot-password")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request New Reset Link
              </button>
              <button
                onClick={() => navigate("/login")}
                className="w-full text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-emerald-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">E-Commerce</h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Reset Password
          </h2>
          <p className="text-slate-600 mb-8">Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Lock className="h-4 w-4 inline mr-2" />
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmNewPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-slate-400" />
                ) : (
                  <Eye className="h-5 w-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Shield className="h-5 w-5 mr-2" />
                Reset Password
              </div>
            )}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-slate-200">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors flex items-center justify-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;