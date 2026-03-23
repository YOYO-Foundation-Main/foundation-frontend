"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import SideBanner from "./SideBanner";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: Props) {
  const [isSignup, setIsSignup] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">

      {/* BACKDROP (ONLY THIS SHOULD BLUR) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-[90%] max-w-5xl flex rounded-2xl overflow-hidden bg-white shadow-2xl">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          <IoClose />
        </button>

        <SideBanner />

        {/* SWITCH FORMS */}
        {isSignup ? (
          <SignupForm switchToLogin={() => setIsSignup(false)} />
        ) : (
          <LoginForm switchToSignup={() => setIsSignup(true)} />
        )}

      </div>
    </div>
  );
}