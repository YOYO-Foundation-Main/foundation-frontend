"use client";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { loginUser, sendOtp, googleLogin, } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { GoogleLogin } from "@react-oauth/google";


type Step = "signup" | "login" | "otp";
type Mode = "password" | "otp";

interface Props {
  setStep: (s: Step) => void;
  setEmail: (email: string) => void;
  onClose: () => void;
}

console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

function decodeJwt(token: string) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return null; }
}


export default function LoginForm({ setStep, setEmail, onClose }: Props) {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmailLocal] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const { setUser } = useAuthStore();

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const handleLogin = async () => {
    if (!email || !password) { showToast("Please fill all fields", "error"); return; }
    try {
      setLoading(true);
      const res = await loginUser({ email, password });

      console.log("✅ LOGIN RES:", res);
      console.log("🔑 TOKEN:", res.token?.slice(0, 30));

      // ✅ Decode JWT to get user info (API only returns token, no user object)
      const decoded = decodeJwt(res.token);
      console.log("🔓 DECODED:", decoded);

      const user = {
        id: decoded?.userId || null,
        name: decoded?.name || email.split("@")[0],
        email: decoded?.email || email,
      };

      console.log("👤 USER TO SAVE:", user);

      // ✅ This saves to Zustand + localStorage "auth-storage" + cookie
      setUser(user);
      showToast("✅ Login successful!", "success");
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      showToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) { showToast("Please enter your email first", "error"); return; }
    try {
      setLoading(true);
      await sendOtp(email);
      setEmail(email);
      showToast("📩 OTP sent!", "success");
      setTimeout(() => setStep("otp"), 800);
    } catch (err: any) {
      showToast(err.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-8 py-8 flex flex-col justify-center overflow-y-auto">

      {toast.msg && (
        <div className={`mb-4 text-sm text-center px-4 py-2 rounded-full font-medium ${toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}>
          {toast.msg}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign in to continue</h2>
      <p className="text-sm text-gray-400 mb-6">
        {mode === "password" ? "Login with your email and password" : "We'll send an OTP to your email"}
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmailLocal(e.target.value)}
          className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-gray-400 bg-gray-50 placeholder:text-gray-400 transition"
        />
      </div>

      {mode === "password" && (
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none focus:border-gray-400 bg-gray-50 placeholder:text-gray-400 pr-11 transition"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end mb-4 mt-1">
        {mode === "password" ? (
          <button onClick={() => setMode("otp")} className="text-sm text-blue-500 hover:underline">
            Login via OTP instead →
          </button>
        ) : (
          <button onClick={() => setMode("password")} className="text-sm text-blue-500 hover:underline">
            ← Login with password instead
          </button>
        )}
      </div>

      <div className="mt-1">
        <p className="text-center text-sm text-gray-500 mb-3">Or</p>
        <div className="flex justify-center gap-4">
          <GoogleLogin
            theme="outline"
            shape="circle"
            size="large"
            text="continue_with"
            onSuccess={async (credentialResponse) => {
              try {
                console.log("Google Response:", credentialResponse);

                if (!credentialResponse.credential) {
                  throw new Error("Google did not return credential");
                }

                const res = await googleLogin(
                  credentialResponse.credential
                );

                console.log("Backend Response:", res);

                setUser(res.user);

                showToast(
                  "Google Login Successful",
                  "success"
                );

                setTimeout(() => {
                  onClose();
                }, 800);

              } catch (err: any) {
                console.error(err);
                showToast(
                  err.message || "Google Login Failed",
                  "error"
                );
              }
            }}
            onError={() => {
              console.log("Google Login Failed");
              showToast("Google Login Failed", "error");
            }}
          />
          <button className="w-11 h-11 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#166fe5] transition">
            <FaFacebook className="text-white" size={18} />
          </button>
        </div>
      </div>

      <p className="text-center text-sm mt-4 text-gray-500">
        Don't have an account?{" "}
        <button onClick={() => setStep("signup")} className="text-red-500 font-medium hover:underline">Register</button>
      </p>

      <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
        By continuing, you agree to the YOYO Foundation Page{" "}
        By continuing, you agree to the YOYO Foundation Page{" "}
        <span className="underline cursor-pointer">terms</span> and acknowledge receipt of our{" "}
        <span className="underline cursor-pointer">privacy notice</span>.
        <span className="underline cursor-pointer">privacy notice</span>.

      </p>

      <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
        {mode === "password" ? (
          <button onClick={handleLogin} disabled={!email || !password || loading}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition ${email && password && !loading
              ? "bg-[#D2252B] text-white hover:bg-red-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
            {loading ? "Please wait..." : "Sign In"}
          </button>
        ) : (
          <button onClick={handleSendOtp} disabled={!email || loading}
            className={`px-8 py-2.5 rounded-full text-sm font-medium transition ${email && !loading
              ? "bg-[#D2252B] text-white hover:bg-red-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}
      </div>
    </div>
  );
}