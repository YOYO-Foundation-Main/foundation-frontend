"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import { adminLogin } from "@/features/admin/api/admin.api";
import { useAdminStore } from "@/features/admin/store/admin.store";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setAdmin } = useAdminStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }

    try {
      setLoading(true);
      setError("");

      const res = await adminLogin({ email, password });

      // ✅ Response: { success: true, token, user: { id, email, role } }
      // No JWT decoding needed — user object comes directly in response
      setAdmin(res.user, res.token);

      console.log("✅ Admin logged in:", res.user);

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);    
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#D2252B] flex items-center justify-center mb-3 shadow-lg shadow-red-900/30">
            <FiShield size={26} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">YOYO Foundation</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@yoyo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D2252B] placeholder:text-gray-600 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D2252B] placeholder:text-gray-600 pr-11 transition"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={!email || !password || loading}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
            email && password && !loading
              ? "bg-[#D2252B] hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-xs text-gray-600 mt-4">
          Admin access only — unauthorized access is prohibited
        </p>
      </div>
    </div>
  );
}