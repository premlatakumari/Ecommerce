import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Loader, ShoppingBag } from "lucide-react";

function LoginPage() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if coming from OTP verification
  useEffect(() => {
    if (location.state?.fromOtpVerification) {
      toast.success("Email verified successfully! Please login to continue.");
    }
  }, [location.state]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(credentials.email, credentials.password);

      if (result.success) {
        const { user } = result;
        console.log("Login successful, user data:", user);
        if (user && user.name) {
          toast.success(`Welcome back, ${user.name}!`);
        } else {
          toast.success("Login successful!");
        }

        if (user?.role === "Admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-emerald-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">E-Commerce</h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-600 mb-8">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="loginEmail"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Mail className="h-4 w-4 inline mr-2" />
              Email Address
            </label>
            <input
              id="loginEmail"
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="loginPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                id="loginPassword"
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
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
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center space-y-4 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Create account
            </button>
          </p>
          <p className="text-sm">
            <button
              onClick={() => navigate("/forgot-password")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Forgot your password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
