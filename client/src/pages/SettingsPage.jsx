import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowLeft, Lock, KeyRound, CheckCircle } from "lucide-react";

function SettingsPage() {
  const { updatePassword, user } = useAuth();
  const navigate = useNavigate();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmNewPassword)
      return toast.error("Passwords do not match");
    if (data.newPassword.length < 8)
      return toast.error("Password must be at least 8 characters");

    setIsLoading(true);
    try {
      const res = await updatePassword(data.currentPassword, data.newPassword, data.confirmNewPassword);
      if (res.success) {
        toast.success("Password updated successfully!");
        setData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      } else toast.error(res.message || "Failed to update password");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardPath = user?.role === "Admin" ? "/admin/dashboard" : "/user/dashboard";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <button
        onClick={() => navigate(dashboardPath)}
        className="absolute top-6 left-6 flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-slate-200"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900">
          Change Password
        </h2>

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-indigo-600" />
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={data.currentPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <KeyRound className="w-4 h-4 mr-2 text-indigo-600" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={data.newPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-indigo-600" />
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmNewPassword"
              value={data.confirmNewPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default SettingsPage;
