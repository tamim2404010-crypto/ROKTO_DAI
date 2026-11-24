import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api.js";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await api.post("/user/verify-email", { email, otp });
      setSuccess(data.message || "Email verified!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Enter your email first");
      return;
    }

    try {
      const { data } = await api.post("/user/resend-otp", { email });
      setSuccess(data.message || "New OTP sent");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP");
    }
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-100";

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-gray-900">Verify your email</h1>
        <p className="text-gray-500 mt-2 text-sm">
          We sent a 6 digit code to your email. Check your spam folder too.
        </p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          {error && (
            <p className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-sm">
              {error}
            </p>
          )}
          {success && (
            <p className="bg-green-50 text-green-700 border border-green-200 rounded-xl p-3 text-sm">
              {success}
            </p>
          )}

          <input
            type="email"
            placeholder="Your email"
            className={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6 digit code"
            className={inputStyle + " text-center text-xl tracking-[0.4em]"}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B42332] hover:bg-[#941C29] disabled:opacity-60 text-white font-bold py-3 rounded-xl"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          className="w-full mt-4 text-[#B42332] font-semibold text-sm"
        >
          Resend code
        </button>

        <Link to="/login" className="block text-center mt-4 text-sm text-gray-500">
          Back to login
        </Link>
      </div>
    </div>
  );
}
