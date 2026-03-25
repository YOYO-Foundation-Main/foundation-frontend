"use client";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { signupUser } from "@/features/auth/api/auth.api";

type Step = "signup" | "login";

interface Props {
  setStep: (s: Step) => void;
}

function Field({
  label,
  required,
  ...props
}: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className="w-full border border-gray-200 rounded-full px-4 py-2.5 text-sm outline-none
          focus:border-gray-400 bg-gray-50 placeholder:text-gray-400 transition"
      />
    </div>
  );
}

export default function SignupForm({ setStep }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const isReady =
    !!form.name &&
    !!form.email &&
    !!form.mobile &&
    !!form.password &&
    !!form.confirmPassword &&
    form.password === form.confirmPassword;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSignup = async () => {
    if (form.password !== form.confirmPassword) {
      showToast("❌ Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      // Send mobile with +91 prefix
      await signupUser({
        name: form.name,
        email: form.email,
        mobile: `+91${form.mobile}`,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      showToast("✅ Signup successful!");
      // Switch to login after short delay so user sees the toast
      setTimeout(() => setStep("login"), 1500);
    } catch (err: any) {
      showToast(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-8 py-6 overflow-y-auto flex flex-col">
      {/* Toast */}
      {toast && (
        <div className={`mb-3 text-sm text-center px-4 py-2 rounded-full font-medium ${
          toast.startsWith("✅") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
        }`}>
          {toast}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sign up to continue</h2>

      {/* Name */}
      <Field
        label="Name" required
        placeholder="Enter your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Email */}
      <Field
        label="Email" required type="email"
        placeholder="Enter your email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Phone with +91 prefix */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="flex border border-gray-200 rounded-full bg-gray-50 overflow-hidden focus-within:border-gray-400 transition">
          <span className="pl-4 pr-2 flex items-center text-sm text-gray-600 font-medium border-r border-gray-200 shrink-0">
            +91
          </span>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={form.mobile}
            maxLength={10}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setForm({ ...form, mobile: val });
            }}
            className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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

      {/* Confirm Password */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className={`w-full border rounded-full px-4 py-2.5 text-sm outline-none
              bg-gray-50 placeholder:text-gray-400 pr-11 transition ${
              form.confirmPassword && form.password !== form.confirmPassword
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-gray-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {/* Mismatch hint */}
        {form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="text-xs text-red-400 mt-1 pl-4">Passwords do not match</p>
        )}
      </div>

      {/* Social */}
      <div className="mt-2">
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

      <p className="text-xs text-center text-gray-400 mt-3 leading-relaxed">
        By continuing, you agree to the YOYO Foundation Terms and acknowledge receipt of our{" "}
        <span className="underline cursor-pointer">privacy notice</span>.
      </p>

      {/* Footer action button (inside form scroll area) */}
      <div className="border-t border-gray-100 pt-4 mt-4 flex justify-end">
        <button
          onClick={handleSignup}
          disabled={!isReady || loading}
          className={`px-8 py-2.5 rounded-full text-sm font-medium transition ${
            isReady && !loading
              ? "bg-[#D2252B] text-white hover:bg-red-700 cursor-pointer"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Please wait..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
}