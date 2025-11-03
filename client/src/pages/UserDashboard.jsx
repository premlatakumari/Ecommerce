import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";
import toast from "react-hot-toast";
import {
  User,
  LogOut,
  Shield,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Loader,
  Settings,
  ChevronDown,
  UserCircle,
} from "lucide-react";

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await dashboardService.user.getUserProfile();
      if (response.success) {
        setProfile(response.data);
      }
    } catch (err) {
      console.error("Fetch Profile Error:", err);
      toast.error(err.message || "Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border border-slate-200">
          <Loader className="animate-spin h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <span className="text-2xl font-bold text-slate-800">
            Loading dashboard...
          </span>
        </div>
      </div>
    );
  }

  const userProfile = profile || user;
  const isActive = userProfile?.status === "active";
  const isVerified = userProfile?.accountVerified;

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 mb-8 border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              User Dashboard
            </h2>
            <p className="text-slate-600 font-medium text-lg">
              Manage your account and view your information
            </p>
          </div>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="flex items-center gap-3">
                {userProfile?.avatar?.url ? (
                  <img
                    src={userProfile.avatar.url}
                    alt={userProfile?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center">
                    <UserCircle className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-slate-900 text-sm">{userProfile?.name}</p>
                  <p className="text-xs text-slate-600">{userProfile?.email}</p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white">
                  <div className="flex items-center gap-3">
                    {userProfile?.avatar?.url ? (
                      <img
                        src={userProfile.avatar.url}
                        alt={userProfile?.name}
                        className="w-14 h-14 rounded-full object-cover border-3 border-white"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                        <UserCircle className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-lg">{userProfile?.name}</p>
                      <p className="text-sm text-indigo-100">{userProfile?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      navigate("/user/profile");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <User className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold">View Profile</p>
                      <p className="text-xs text-slate-500">See your profile details</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate("/user/settings");
                      setShowProfileDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-semibold">Change Password</p>
                      <p className="text-xs text-slate-500">Update your password</p>
                    </div>
                  </button>

                  <hr className="my-2 border-slate-200" />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <div>
                      <p className="font-semibold">Sign Out</p>
                      <p className="text-xs text-red-400">Logout from your account</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl mb-4 shadow-lg"
            style={{ backgroundColor: isActive ? "#10b981" : "#ef4444" }}
          >
            {isActive ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <XCircle className="h-8 w-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Account Status
          </h3>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-md ${
              isActive
                ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                : "bg-gradient-to-r from-red-400 to-pink-500 text-white"
            }`}
          >
            {isActive ? (
              <>
                <CheckCircle className="h-4 w-4" />
                ACTIVE
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                INACTIVE
              </>
            )}
          </span>
          <p className="text-sm text-slate-600 mt-3 font-medium">
            {isActive
              ? "Your account is fully functional"
              : "Your account is currently inactive. Contact Admin."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div
            className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl mb-4 shadow-lg"
            style={{ backgroundColor: isVerified ? "#10b981" : "#f59e0b" }}
          >
            {isVerified ? (
              <CheckCircle className="h-8 w-8 text-white" />
            ) : (
              <Calendar className="h-8 w-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Verification Status
          </h3>
          <span
            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-md ${
              isVerified
                ? "bg-gradient-to-r from-emerald-400 to-green-500 text-white"
                : "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle className="h-4 w-4 mr-1" />
                VERIFIED
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-1" />
                PENDING
              </>
            )}
          </span>
          <p className="text-sm text-slate-600 mt-3 font-medium">
            {isVerified
              ? "Your email is verified"
              : "Please verify your email address"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4 shadow-lg">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">
            Account Type
          </h3>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-purple-400 to-indigo-500 text-white shadow-md">
            <Shield className="h-4 w-4 mr-1" />
            {userProfile?.role?.toUpperCase()}
          </span>
          <p className="text-sm text-slate-600 mt-3 font-medium">
            Your account privileges and access level
          </p>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Profile Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Full Name
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.name || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                Email Address
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.email || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Phone className="h-4 w-4 mr-1" />
                Phone Number
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.phone || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date of Birth
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.dateOfBirth
                  ? new Date(userProfile.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </dd>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Address
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.address || "Not provided"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Member Since
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString()
                  : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Last Login
              </dt>
              <dd className="mt-1 text-sm text-slate-900">
                {userProfile?.lastLogin
                  ? new Date(userProfile.lastLogin).toLocaleString()
                  : "Unknown"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Account ID</dt>
              <dd className="mt-1 text-sm text-slate-900 font-mono">
                {userProfile?._id?.slice(-12) || "Unknown"}
              </dd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;