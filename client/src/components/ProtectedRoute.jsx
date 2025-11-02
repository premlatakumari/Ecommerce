import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle, Loader, ArrowLeft } from "lucide-react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isActive, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card text-center max-w-md">
          <Loader className="animate-spin h-12 w-12 text-emerald-600 mx-auto mb-6" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Loading...
          </h2>
          <p className="text-slate-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="card text-center max-w-md">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Account Inactive
          </h2>
          <p className="error-message mb-6">
            Your account is currently inactive. Please contact support.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (requiredRole) {
    if (requiredRole === "Admin" && user.role !== "Admin") {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="card text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Access Denied
            </h2>
            <p className="error-message mb-6">
              You do not have administrator privileges.
            </p>
            <button
              onClick={() => (window.location.href = "/user/dashboard")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to User Dashboard
            </button>
          </div>
        </div>
      );
    }

    if (requiredRole === "User" && user.role !== "User") {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="card text-center max-w-md">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Access Denied
            </h2>
            <p className="error-message mb-6">
              This page is for regular users only.
            </p>
            <button
              onClick={() => (window.location.href = "/admin/dashboard")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Admin Dashboard
            </button>
          </div>
        </div>
      );
    }
  }
  return children;
};

export default ProtectedRoute;