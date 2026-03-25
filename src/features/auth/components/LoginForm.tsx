"use client";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { loginUser, sendOtp } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

type Step = "signup" | "login" | "otp";

interface Props {
  setStep: (s: Step) => void;
  setEmail?: (email: string) => void; // for OTP flow
  onClose: () => void;
}

export default function LoginForm({ setStep, setEmail, onClose }: Props) {
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const { setUser } = useAuthStore(); // ✅ STORE

  const isReady = !!email && !!password;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ================= NORMAL LOGIN =================
  const handleLogin = async () => {
    try {
      setLoading(true);

      console.log("📤 LOGIN:", { email, password });

      const res = await loginUser({ email, password });

      console.log("✅ LOGIN RESPONSE:", res);

      // ✅ SAVE USER + TOKEN
      setUser(res.user, res.token);

      showToast("✅ Login successful!");

      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      console.error("❌ LOGIN ERROR:", err);
      showToast(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ================= SEND OTP =================
  const handleOtpLogin = async () => {
    try {
      setLoading(true);

      console.log("📤 SEND OTP:", email);

      await sendOtp(email);

      console.log("✅ OTP SENT");

      showToast("📩 OTP sent to email");

      // move to OTP screen
      setEmail && setEmail(email);
      setStep("otp");
    } catch (err: any) {
      console.error("❌ OTP ERROR:", err);
      showToast(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-8 py-8 flex flex-col justify-center">
      {/* Toast */}
      {toast && (
        <div
          className={`mb-4 text-sm text-center px-4 py-2 rounded-full font-medium ${
            toast.startsWith("✅") || toast.startsWith("📩")
              ? "bg-green-50 text-green-600"
              : "bg-red-50 text-red-500"
          }`}
        >
          {toast}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Sign in to continue
      </h2>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmailLocal(e.target.value)}
          className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none
            focus:border-gray-400 bg-gray-50 placeholder:text-gray-400 transition"
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none
              focus:border-gray-400 bg-gray-50 placeholder:text-gray-400 pr-11 transition"
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
      </div>

      {/* ✅ LOGIN VIA OTP (WORKING NOW) */}
      <p
        onClick={handleOtpLogin}
        className="text-sm text-right text-blue-500 cursor-pointer hover:underline mb-4 -mt-2"
      >
        Login via OTP instead
      </p>

      {/* Social */}
      <div className="mt-1">
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

      <p className="text-center text-sm mt-4 text-gray-500">
        Don't have an account?{" "}
        <button
          onClick={() => setStep("signup")}
          className="text-red-500 font-medium hover:underline"
        >
          Register
        </button>
      </p>

      <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
        By continuing, you agree to the YOYO Foundation{" "}
        <span className="underline cursor-pointer">terms</span> and acknowledge
        receipt of our{" "}
        <span className="underline cursor-pointer">privacy notice</span>.
      </p>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
        <button
          onClick={handleLogin}
          disabled={!isReady || loading}
          className={`px-8 py-2.5 rounded-full text-sm font-medium transition ${
            isReady && !loading
              ? "bg-[#D2252B] text-white hover:bg-red-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Please wait..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}