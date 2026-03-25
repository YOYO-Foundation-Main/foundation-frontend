"use client";
import { useState, useEffect } from "react";
import SideBanner from "./SideBanner";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
// import OtpForm from "./OtpForm";
import OtpForm from "./OTPForm";

type Step = "signup" | "login" | "otp";

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("signup");
  const [email, setEmail] = useState(""); // ✅ for OTP

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("signup");
      setEmail("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white w-full max-w-[780px] rounded-2xl overflow-hidden flex shadow-2xl"
        style={{ minHeight: 520 }}
      >
        {/* LEFT */}
        <SideBanner />

        {/* RIGHT */}
        <div className="flex flex-col flex-1 relative">

          {/* TOP RIGHT BUTTON */}
          <div className="absolute top-4 right-4 z-10">
            {step === "login" ? (
              <button
                onClick={() => setStep("signup")}
                className="border border-red-500 text-red-500 text-sm px-5 py-1.5 rounded-full hover:bg-red-50 transition"
              >
                Sign Up
              </button>
            ) : (
              <button
                onClick={() => setStep("login")}
                className="border border-red-500 text-red-500 text-sm px-5 py-1.5 rounded-full hover:bg-red-50 transition"
              >
                Sign In
              </button>
            )}
          </div>

          {/* STEPS */}
          {step === "signup" && (
            <SignupForm setStep={setStep} />
          )}

          {step === "login" && (
            <LoginForm
              setStep={setStep}
              setEmail={setEmail} // ✅ pass email to OTP
              onClose={onClose}
            />
          )}

          {step === "otp" && (
            <OtpForm
              email={email} // ✅ send email
              onClose={onClose} // optional close after verify
            />
          )}
        </div>
      </div>
    </div>
  );
}