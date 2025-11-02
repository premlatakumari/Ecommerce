import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
  Eye,
  EyeOff,
  ShoppingBag,
  Upload,
  Check,
  ImageIcon,
  LogIn,
} from "lucide-react";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    avatar: null,
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return "Phone number is required";
    if (phone.length !== 10) {
      return "Phone number must be 10 digits";
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsLoading(true);
      const response = await register(formData);

      if (response.success) {
        toast.success(
          response.message || "OTP sent to your email successfully!"
        );
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        toast.error(
          response.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name.trim()) {
      return "Name is required";
    }
    if (formData.name.trim().length < 3) {
      return "Name must be at least 3 characters long";
    }

    // Email validation
    if (!formData.email.trim()) {
      return "Email is required";
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    // Phone validation
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      return phoneError;
    }

    // Password validation
    if (!formData.password) {
      return "Password is required";
    }
    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      return "Date of birth is required";
    }
    const birthDate = new Date(formData.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      return "You must be at least 13 years old to register";
    }
    if (age > 120) {
      return "Please enter a valid date of birth";
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl border border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-emerald-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">E-Commerce</h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create Account
          </h2>
          <p className="text-slate-600 mb-8">Join our platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter Your Name"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter Your Email"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                onChange={handlePhoneChange}
                value={formData.phone}
                placeholder="Enter 10-digit ph-number"
                maxLength="10"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
              {formData.phone && validatePhone(formData.phone) && (
                <p className="mt-1 text-sm text-red-600">
                  {validatePhone(formData.phone)}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                <Calendar className="h-4 w-4 inline mr-2" />
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                onChange={handleChange}
                value={formData.dateOfBirth}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <MapPin className="h-4 w-4 inline mr-2" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows="3"
              onChange={handleChange}
              value={formData.address}
              placeholder="Enter Your complete address"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                value={formData.password}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 pr-12"
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
              htmlFor="avatar"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <Upload className="h-4 w-4 inline mr-2" />
              Profile Photo
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-slate-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <label
                    htmlFor="avatar"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-emerald-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="avatar"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
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
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
