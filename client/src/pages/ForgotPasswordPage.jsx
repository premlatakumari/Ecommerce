import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, ShoppingBag, Send } from "lucide-react";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);
      const result = await forgotPassword(email);

      if (result.success) {
        toast.success(
          result.message || "Password reset link sent to your email!"
        );
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(result.message || "Failed to send reset email");
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);
      toast.error("Failed to send reset email. Please try again.");
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
            Forgot Password
          </h2>
          <p className="text-slate-600 mb-8">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your email"
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Reset Link...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="h-5 w-5 mr-2" />
                Send Reset Link
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

export default ForgotPasswordPage;
