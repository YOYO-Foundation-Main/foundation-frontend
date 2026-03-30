const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;

// ✅ Save token in localStorage + cookie
function saveToken(token: string) {
  localStorage.setItem("token", token);
  document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

// ✅ Clear token from both
function clearToken() {
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; max-age=0";
}

// ================= LOGIN =================
export const loginUser = async (data: { email: string; password: string }) => {
  console.log("📤 [LOGIN]:", data);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log("📡 [LOGIN STATUS]:", res.status);
  console.log("📥 [LOGIN RESPONSE]:", result);

  if (!res.ok) throw new Error(result.message || "Login failed");

  if (result.token) {
    saveToken(result.token);
    console.log("🔐 TOKEN SAVED");
  }

  return result;
};

// ================= SIGNUP =================
export const signupUser = async (data: any) => {
  console.log("📤 [SIGNUP]:", data);

  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log("📡 [SIGNUP STATUS]:", res.status);
  console.log("📥 [SIGNUP RESPONSE]:", result);

  if (!res.ok) throw new Error(result.message || "Signup failed");

  return result;
};

// ================= SEND OTP (first time) =================
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

  if (!res.ok) throw new Error(result.error || result.message || "Failed to send OTP");

  return result;
};

// ================= RESEND OTP (different endpoint) =================
export const resendOtp = async (email: string) => {
  console.log("📤 [RESEND OTP]:", email);

  const res = await fetch(`${BASE_URL}/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email }),
  });

  const result = await res.json();
  console.log("📡 [RESEND OTP STATUS]:", res.status);
  console.log("📥 [RESEND OTP RESPONSE]:", result);

  if (!res.ok) throw new Error(result.error || result.message || "Failed to resend OTP");

  return result;
};

// ================= VERIFY OTP =================
export const verifyOtp = async (email: string, otp: string) => {
  console.log("📤 [VERIFY OTP]:", email, otp);

  const res = await fetch(`${BASE_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, otp }),
  });

  const result = await res.json();
  console.log("📡 [VERIFY OTP STATUS]:", res.status);
  console.log("📥 [VERIFY OTP RESPONSE]:", result);

  if (!res.ok) throw new Error(result.error || result.message || "OTP verification failed");

  if (result.token) {
    saveToken(result.token);
    console.log("🔐 TOKEN SAVED (OTP)");
  }

  return result;
};

// ================= LOGOUT =================
export const logoutUser = () => {
  clearToken();
};