"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
// import OtpForm from "./OtpForm";
import OtpForm from "./OTPForm";
  

export default function AuthModal({ isOpen, onClose }: any) {
  const [step, setStep] = useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  console.log("🧠 MODAL STATE:", step);

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-[500px] p-6 relative">

        {step === "login" && (
          <LoginForm
            setStep={setStep}
            setEmail={setEmail}
          />
        )}

        {step === "signup" && (
          <SignupForm setStep={setStep} />
        )}

        {step === "otp" && (
          <OtpForm email={email} />
        )}

        <button onClick={onClose} className="absolute top-2 right-2">
          ❌
        </button>
      </div>
    </div>
  );
}