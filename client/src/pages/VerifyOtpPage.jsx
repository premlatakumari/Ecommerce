import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Mail,
  Loader,
  ShoppingBag,
  Check,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

function VerifyOtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from registration
  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      toast.error("Please register first");
      navigate("/register");
    } else {
      setEmail(emailFromState);
    }
  }, [location.state, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 5) {
      toast.error("Please enter a 5-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(email, otp);
      if (result.success) {
        setTimeout(() => {
          navigate("/login", { state: { fromOtpVerification: true, email } });
        }, 1500);
      } else {
        toast.error(result.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;

    setIsResending(true);
    try {
      const result = await resendOTP(email);
      if (result.success) {
        toast.success("OTP sent! Check your email.");
        setCountdown(60);
        setOtp("");
      } else {
        toast.error(result.message || "Failed to resend");
      }
    } catch (err) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (sec) =>
    `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-slate-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-emerald-600 mr-3" />
            <h1 className="text-2xl font-bold text-slate-900">E-Commerce</h1>
          </div>
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Verify Email
          </h2>
          <p className="text-slate-600 text-sm">Code sent to</p>
          <p className="font-medium text-slate-900">{email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 text-center mb-3">
              Enter 5-digit code
            </label>
            <OTPBoxes otp={otp} setOtp={setOtp} disabled={isLoading} />
            <p className="text-xs text-slate-500 text-center mt-2">
              Check your email for the verification code
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 5}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <Check className="h-5 w-5 mr-2" />
                Verify Account
              </>
            )}
          </button>
        </form>

        {/* Resend & Back */}
        <div className="mt-6 pt-6 border-t border-slate-200 text-center space-y-3">
          <p className="text-sm text-slate-600">Didn't receive it?</p>
          <button
            onClick={handleResend}
            disabled={countdown > 0 || isResending}
            className={`text-sm font-medium flex items-center justify-center mx-auto transition-colors ${
              countdown > 0 || isResending
                ? "text-slate-400 cursor-not-allowed"
                : "text-emerald-600 hover:text-emerald-500"
            }`}
          >
            {isResending ? (
              <>
                <Loader className="animate-spin h-4 w-4 mr-1" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${formatTime(countdown)}`
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-1" />
                Resend Code
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/register")}
            className="text-sm text-slate-600 hover:text-slate-500 flex items-center justify-center mx-auto mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Register
          </button>
        </div>
      </div>
    </div>
  );
}

// Five OTP Input Boxes Component
const OTPBoxes = ({ otp, setOtp, disabled }) => {
  const digits = otp.padEnd(5, "").split("").slice(0, 5);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = (otp.slice(0, index) + value + otp.slice(index + 1)).slice(
      0,
      5
    );
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 5);
    setOtp(paste);
    const next = paste.length < 5 ? paste.length : 5;
    setTimeout(() => document.getElementById(`otp-${next}`)?.focus(), 0);
  };

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {Array.from({ length: 5 }, (_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          maxLength={1}
          value={digits[i]}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-2xl font-mono rounded-md border
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200
            ${digits[i] ? "border-emerald-500" : "border-slate-300"}
          `}
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default VerifyOtpPage;