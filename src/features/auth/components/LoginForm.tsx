"use client";
import { useState } from "react";
import { sendOtp } from "@/features/auth/api/auth.api";

export default function LoginForm({ setStep, setEmail }: any) {
  const [email, setEmailLocal] = useState("");

  const handleOtp = async () => {
    console.log("👉 CLICK LOGIN VIA OTP");
    console.log("📧 Email:", email);

    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      const res = await sendOtp(email);

      console.log("✅ OTP SENT:", res);

      alert("OTP sent ✅");

      setEmail(email);   // store globally
      setStep("otp");    // go to OTP screen
    } catch (err: any) {
      console.log("❌ OTP ERROR:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Login via OTP</h2>

      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => {
          console.log("✏️ Typing:", e.target.value);
          setEmailLocal(e.target.value);
        }}
        className="border px-4 py-2 w-full mb-4"
      />

      <button
        onClick={handleOtp}
        className="bg-red-500 text-white w-full py-2"
      >
        Send OTP
      </button>

      <p
        onClick={() => setStep("signup")}
        className="mt-4 text-sm text-blue-500 cursor-pointer text-center"
      >
        Create Account
      </p>
    </div>
  );
}