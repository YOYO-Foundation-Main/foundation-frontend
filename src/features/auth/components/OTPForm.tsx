"use client";
import { useState } from "react";
import { verifyOtp } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function OtpForm({ email, onClose }: any) {
  const [otp, setOtp] = useState("");
  const { setUser } = useAuthStore();

  const handleVerify = async () => {
    try {
      const res = await verifyOtp(email, otp);

      console.log("✅ VERIFIED:", res);

      // ✅ SAVE USER
      setUser(res.user, res.token);

      alert("You are logged in 🎉");

      onClose && onClose(); // close modal
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl mb-4">Enter OTP</h2>

      <input
        type="text"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border px-4 py-2 mb-4"
      />

      <button
        onClick={handleVerify}
        className="bg-green-600 text-white px-4 py-2 w-full"
      >
        Verify OTP
      </button>
    </div>
  );
}