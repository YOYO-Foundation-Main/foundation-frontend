"use client";

import { useAuthStore } from "../store/auth.store";
import { sendOtp, verifyOtp } from "../api/auth.api";

export default function useAuth() {
  const { user, setUser, logout } = useAuthStore();

  // ================= SEND OTP =================
  const sendLoginOtp = async (email: string) => {
    try {
      console.log("📤 [HOOK] Sending OTP:", email);

      const res = await sendOtp(email);

      console.log("✅ [HOOK] OTP Sent:", res);

      return res;
    } catch (err: any) {
      console.error("❌ [HOOK] Send OTP Error:", err.message);
      throw err;
    }
  };

  // ================= VERIFY OTP =================
  const verifyLoginOtp = async (email: string, otp: string) => {
    try {
      console.log("📤 [HOOK] Verifying OTP:", otp);

      const res = await verifyOtp(email, otp);

      console.log("✅ [HOOK] OTP Verified:", res);

if (res?.user && res?.token) {
  setUser(res.user, res.token); 
}

      return res;
    } catch (err: any) {
      console.error("❌ [HOOK] Verify OTP Error:", err.message);
      throw err;
    }
  };

  return {
    user,
    sendLoginOtp,
    verifyLoginOtp,
    logout,
  };
}