import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Loader,
  Settings,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response =
        user?.role === "Admin"
          ? await dashboardService.admin.getAdminProfile()
          : await dashboardService.user.getUserProfile();

      if (response.success) setProfile(response.data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader className="animate-spin w-10 h-10 text-indigo-600" />
      </div>
    );
  }

  const userProfile = profile || user;
  const isActive = userProfile?.status === "active";
  const isVerified = userProfile?.accountVerified;
  const dashboardPath =
    user?.role === "Admin" ? "/admin/dashboard" : "/user/dashboard";
  const settingsPath =
    user?.role === "Admin" ? "/admin/settings" : "/user/settings";

  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(dashboardPath)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
        <button
          onClick={() => navigate(settingsPath)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Settings className="w-5 h-5" /> Settings
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200 p-6 md:p-8 text-center">
        <div className="flex flex-col items-center">
          {userProfile?.avatar?.url ? (
            <img
              src={userProfile.avatar.url}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white">
              <User className="w-16 h-16" />
            </div>
          )}

          <h2 className="mt-4 text-2xl font-bold text-slate-900">
            {userProfile?.name || "No Name"}
          </h2>
          <p className="text-slate-600">{userProfile?.email}</p>

          <div className="flex gap-3 mt-4">
            <span
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
              {isActive ? "Active" : "Inactive"}
            </span>

            <span
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                isVerified
                  ? "bg-blue-100 text-blue-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              <Shield size={16} />
              {isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 text-left">
          <InfoItem icon={Mail} label="Email" value={userProfile?.email} />
          <InfoItem icon={Phone} label="Phone" value={userProfile?.phone} />
          <InfoItem
            icon={Calendar}
            label="Date of Birth"
            value={
              userProfile?.dateOfBirth
                ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                : "Not provided"
            }
          />
          <InfoItem
            icon={MapPin}
            label="Address"
            value={userProfile?.address || "Not provided"}
          />
          <InfoItem
            icon={Calendar}
            label="Member Since"
            value={
              userProfile?.createdAt
                ? new Date(userProfile.createdAt).toLocaleDateString()
                : "Unknown"
            }
          />
          <InfoItem
            icon={Calendar}
            label="Last Login"
            value={
              userProfile?.lastLogin
                ? new Date(userProfile.lastLogin).toLocaleString()
                : "Unknown"
            }
          />
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
      <Icon className="w-4 h-4 text-indigo-600" /> {label}
    </div>
    <p className="text-slate-900">{value}</p>
  </div>
);

export default ProfilePage;
