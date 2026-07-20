// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { FiEye, FiEyeOff, FiShield } from "react-icons/fi";
// import { adminLogin } from "@/features/admin/api/admin.api";
// import { useAdminStore } from "@/features/admin/store/admin.store";

// export default function AdminLoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const { setAdmin } = useAdminStore();
//   const router = useRouter();

//   const handleLogin = async () => {
//     if (!email || !password) { setError("Please fill all fields"); return; }

//     try {
//       setLoading(true);
//       setError("");

//       const res = await adminLogin({ email, password });

//       // ✅ Response: { success: true, token, user: { id, email, role } }
//       // No JWT decoding needed — user object comes directly in response
//       setAdmin(res.user, res.token);

//       console.log("✅ Admin logged in:", res.user);

//       router.push("/admin/dashboard");
//     } catch (err: any) {
//       setError(err.message || "Login failed");
//     } finally {
//       setLoading(false);    
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
//       <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">

//         {/* Header */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-14 h-14 rounded-full bg-[#D2252B] flex items-center justify-center mb-3 shadow-lg shadow-red-900/30">
//             <FiShield size={26} className="text-white" />
//           </div>
//           <h1 className="text-xl font-bold text-white">Admin Panel</h1>
//           <p className="text-sm text-gray-500 mt-1">YOYO Foundation</p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div className="mb-5 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 text-center">
//             {error}
//           </div>
//         )}

//         {/* Email */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-400 mb-1.5">
//             Email
//           </label>
//           <input
//             type="email"
//             placeholder="admin@yoyo.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//             className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D2252B] placeholder:text-gray-600 transition"
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-400 mb-1.5">
//             Password
//           </label>
//           <div className="relative">
//             <input
//               type={showPass ? "text" : "password"}
//               placeholder="Enter password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleLogin()}
//               className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#D2252B] placeholder:text-gray-600 pr-11 transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
//             >
//               {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
//             </button>
//           </div>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handleLogin}
//           disabled={!email || !password || loading}
//           className={`w-full py-2.5 rounded-xl text-sm font-semibold transition ${
//             email && password && !loading
//               ? "bg-[#D2252B] hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
//               : "bg-gray-800 text-gray-600 cursor-not-allowed"
//           }`}
//         >
//           {loading ? "Signing in..." : "Sign In"}
//         </button>

//         <p className="text-center text-xs text-gray-600 mt-4">
//           Admin access only — unauthorized access is prohibited
//         </p>
//       </div>
//     </div>
//   );
// }




"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { adminLogin } from "@/features/admin/api/admin.api";
import { useAdminStore } from "@/features/admin/store/admin.store";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  const { setAdmin } = useAdminStore();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill all fields"); return; }
    try {
      setLoading(true);
      setError("");
      const res = await adminLogin({ email, password });

      console.log("STEP 1");

      setAdmin(res.user);

      console.log("STEP 2");

      if (res.user.role === "SUPER_ADMIN") {
        console.log("GO SUPER");
        router.replace("/admin/super/dashboard");
      } else {
        console.log("GO ADMIN");
        router.replace("/admin/dashboard");
      }

      setTimeout(() => {
        console.log("Current URL:", window.location.pathname);
      }, 1000);

      console.log("STEP 4");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#FAFAF8]">

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#D2252B] relative overflow-hidden px-14 py-12">

        {/* Background geometric shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/3 -right-16 w-64 h-64 rounded-full bg-black/10" />
          <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-48 left-20 w-32 h-32 rounded-2xl bg-white/5 rotate-12" />
          <div className="absolute bottom-40 right-10 w-20 h-20 rounded-xl bg-white/8 -rotate-6" />
          {/* Grid dots */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* Logo / Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#D2252B" />
                <path d="M2 17l10 5 10-5" stroke="#D2252B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <path d="M2 12l10 5 10-5" stroke="#D2252B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">YOYO Foundation</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-white/90 text-xs font-medium tracking-wide uppercase">Secure Admin Portal</span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Manage with<br />
              <span className="text-white/70">confidence.</span>
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              The YOYO Foundation admin panel gives you full control over operations, data, and insights — securely.
            </p>
          </div>

          {/* Stats row */}
          <div
            className={`flex gap-8 mt-10 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: "250ms" }}
          >
            {[{ val: "24/7", label: "Uptime" }, { val: "256-bit", label: "Encryption" }, { val: "SOC 2", label: "Compliant" }].map((s) => (
              <div key={s.label}>
                <div className="text-white font-bold text-xl">{s.val}</div>
                <div className="text-white/50 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © 2025 YOYO Foundation · Admin Access Only
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF8]">
        <div
          className={`w-full max-w-[420px] transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "150ms" }}
        >

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#D2252B] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
                <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">YOYO Foundation</span>
          </div>

          {/* Heading */}
          <div className="mb-10">
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.02em" }}
            >
              Welcome back
            </h1>
            <p className="text-gray-400 text-sm">Sign in to your admin account to continue</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
              <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 20 20" fill="#D2252B">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-[#D2252B] text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Email address
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D2252B] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="admin@yoyo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-11 pr-4 py-3.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-[#D2252B] focus:ring-4 focus:ring-red-50 hover:border-gray-300"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Password
              </label>
              <button className="text-xs text-[#D2252B] font-medium hover:opacity-70 transition-opacity">
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D2252B] transition-colors duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full pl-11 pr-12 py-3.5 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-[#D2252B] focus:ring-4 focus:ring-red-50 hover:border-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-600 transition-colors"
              >
                {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleLogin}
            disabled={!email || !password || loading}
            className={`relative w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden ${email && password && !loading
              ? "bg-[#D2252B] hover:bg-[#B81E23] text-white shadow-lg shadow-red-200 active:scale-[0.98]"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing you in…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign in to Admin Panel
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-300 text-xs">secured by</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-5">
            {[
              { icon: "🔒", label: "256-bit SSL" },
              { icon: "🛡️", label: "2FA Ready" },
              { icon: "✅", label: "Audit Logs" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1">
                <span className="text-lg">{b.icon}</span>
                <span className="text-[10px] text-gray-400 font-medium">{b.label}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-[11px] text-gray-300 mt-8">
            Unauthorized access is strictly prohibited and monitored.
          </p>
        </div>
      </div>

      {/* Google Fonts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
      `}</style>
    </div>
  );
}
