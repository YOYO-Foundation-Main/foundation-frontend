"use client";

import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import SideBanner from "./SideBanner";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import OtpForm from "./OTPForm";

type Step = "signup" | "login" | "otp";

export default function AuthModal({
  isOpen,
  onClose,
  initialStep = "login", // ✅ NEW: control from parent
}: {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [email, setEmail] = useState("");

  // ✅ Reset state properly on open
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setEmail("");
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div
        className="bg-white w-full max-w-[820px] rounded-2xl overflow-hidden flex shadow-2xl animate-[fadeIn_.2s_ease]"
        style={{ minHeight: 520 }}
      >
        {/* ── LEFT ── */}
        <SideBanner />

        {/* ── RIGHT ── */}
        <div className="flex flex-col flex-1">

          {/* ── TOP BAR ── */}
          <div className="flex items-center justify-between px-5 pt-4">
            {/* Close */}
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
            >
              <RxCross2 size={16} />
            </button>

            {/* Toggle */}
            {step === "login" ? (
              <button
                onClick={() => setStep("signup")}
                className="border border-[#D2252B] text-[#D2252B] text-sm px-5 py-1.5 rounded-full hover:bg-red-50 transition font-medium"
              >
                Create Account
              </button>
            ) : step !== "otp" ? (
              <button
                onClick={() => setStep("login")}
                className="border border-[#D2252B] text-[#D2252B] text-sm px-5 py-1.5 rounded-full hover:bg-red-50 transition font-medium"
              >
                Sign In
              </button>
            ) : null}
          </div>

          {/* ── CONTENT ── */}
          <div className="flex-1 flex items-center justify-center px-6 pb-6 pt-2">

            {step === "signup" && (
              <SignupForm setStep={setStep} />
            )}

            {step === "login" && (
              <LoginForm
                setStep={setStep}
                setEmail={setEmail}
                onClose={onClose}
              />
            )}

            {step === "otp" && (
              <OtpForm
                email={email}
                onClose={onClose}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}