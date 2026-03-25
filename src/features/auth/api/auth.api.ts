const BASE_URL = "https://foundationbackendrepo.onrender.com/api/auth";

// ================= LOGIN =================
export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  console.log("📤 [LOGIN]:", data);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log("📡 [LOGIN STATUS]:", res.status);
  console.log("📥 [LOGIN RESPONSE]:", result);

  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }

  // ✅ SAVE TOKEN
  if (result.token) {
    localStorage.setItem("token", result.token);
    console.log("🔐 TOKEN SAVED");
  }

  return result;
};

// ================= SIGNUP =================
export const signupUser = async (data: any) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Signup failed");
  }

  return result;
};

// ================= SEND OTP =================
export const sendOtp = async (email: string) => {
  console.log("📤 [SEND OTP]:", email);

  const res = await fetch(`${BASE_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email }),
  });

  const result = await res.json();

  console.log("📡 [SEND OTP STATUS]:", res.status);
  console.log("📥 [SEND OTP RESPONSE]:", result);

  if (!res.ok) {
    throw new Error(result.error || result.message || "Failed to send OTP");
  }

  return result;
};

// ================= VERIFY OTP =================
export const verifyOtp = async (email: string, otp: string) => {
  console.log("📤 [VERIFY OTP]:", email, otp);

  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: email,
      otp,
    }),
  });

  const result = await res.json();

  console.log("📡 [VERIFY OTP STATUS]:", res.status);
  console.log("📥 [VERIFY OTP RESPONSE]:", result);

  if (!res.ok) {
    throw new Error(result.error || result.message || "OTP verification failed");
  }

  // ✅ SAVE TOKEN AFTER OTP LOGIN
  if (result.token) {
    localStorage.setItem("token", result.token);
    console.log("🔐 TOKEN SAVED (OTP)");
  }

  return result;
};