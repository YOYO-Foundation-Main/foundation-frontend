"use client";
import { useState, useRef, useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { verifyOtp, sendOtp } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface Props {
  email: string;
  onClose: () => void;
}

function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function OTPForm({ email, onClose }: Props) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const [timer, setTimer] = useState(300); // ✅ 5 minutes = 300 seconds
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const { setUser } = useAuthStore();

  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // ✅ 5 min countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // Auto focus first box
  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  // Format timer as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    // Auto advance
    if (val && i < 5) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      refs[i - 1].current?.focus();
    }
  };

  // ✅ Paste support — paste 6 digits at once
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    // Focus last filled box
    const lastIdx = Math.min(pasted.length, 5);
    refs[lastIdx].current?.focus();
  };

  // ✅ Verify OTP and login
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) { showToast("Enter all 6 digits", "error"); return; }
    if (timer <= 0) { showToast("OTP expired. Please resend.", "error"); return; }

    try {
      setLoading(true);
      const res = await verifyOtp(email, code);

      const decoded = decodeJwt(res.token);
      const user = {
        id: decoded?.userId || null,
        name: decoded?.name || email.split("@")[0],
        email: decoded?.email || email,
      };

      setUser(user, res.token);

      // Save cookie for middleware
      document.cookie = `token=${res.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

      showToast("✅ Login successful!", "success");
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      showToast(err.message || "Invalid OTP", "error");
      // Clear boxes on wrong OTP
      setOtp(["", "", "", "", "", ""]);
      refs[0].current?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP — reset timer to 5 min
  const handleResend = async () => {
    try {
      await sendOtp(email);
      setTimer(300); // reset to 5 min
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => refs[0].current?.focus(), 100);
      showToast("📩 OTP resent to your email!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to resend OTP", "error");
    }
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="flex-1 px-8 py-8 flex flex-col justify-center overflow-y-auto">

      {/* Toast */}
      {toast.msg && (
        <div className={`mb-4 text-sm text-center px-4 py-2 rounded-full font-medium ${
          toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
        }`}>
          {toast.msg}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Enter OTP</h2>
      <p className="text-sm text-gray-500 mb-6">
        We sent a 6-digit code to{" "}
        <span className="font-semibold text-gray-700">{email}</span>
      </p>

      {/* ✅ 6-box OTP input */}
      <div className="flex gap-2 mb-4" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={`w-11 h-12 text-center text-lg font-semibold border-2 rounded-lg outline-none transition ${
              digit
                ? "border-red-400 bg-red-50 text-red-600"
                : "border-gray-200 bg-gray-50 text-gray-700"
            } focus:border-red-400`}
          />
        ))}
      </div>

      {/* ✅ Timer */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <FiClock
            className={timer <= 60 ? "text-red-500" : "text-[#D2252B]"}
            size={14}
          />
          <span className={`text-sm font-semibold ${
            timer <= 60 ? "text-red-500" : "text-gray-600"
          }`}>
            {timer > 0 ? formatTime(timer) : "OTP Expired"}
          </span>
          {timer > 0 && (
            <span className="text-xs text-gray-400">remaining</span>
          )}
        </div>

        {/* Resend button */}
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className={`text-sm font-medium transition ${
            timer > 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-[#D2252B] hover:underline cursor-pointer"
          }`}
        >
          Resend OTP
        </button>
      </div>

      {/* Expired warning */}
      {timer === 0 && (
        <p className="text-xs text-red-400 mb-4">
          Your OTP has expired. Please click Resend OTP to get a new one.
        </p>
      )}

      {/* Social */}
      <div className="mt-4">
        <p className="text-center text-sm text-gray-500 mb-3">Or</p>
        <div className="flex justify-center gap-4">
          <button className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <FaGoogle className="text-[#EA4335]" size={18} />
          </button>
          <button className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#166fe5] transition">
            <FaFacebook className="text-white" size={18} />
          </button>
        </div>
      </div>

      <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
        By continuing, you agree to the YOYO Foundation{" "}
        <span className="underline cursor-pointer">terms</span> and acknowledge receipt of our{" "}
        <span className="underline cursor-pointer">privacy notice</span>.
      </p>

      {/* Footer button */}
      <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
        <button
          onClick={handleVerify}
          disabled={!otpFilled || loading || timer === 0}
          className={`px-8 py-2.5 rounded-full text-sm font-medium transition ${
            otpFilled && !loading && timer > 0
              ? "bg-[#D2252B] text-white hover:bg-red-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </button>
      </div>
    </div>
  );
}