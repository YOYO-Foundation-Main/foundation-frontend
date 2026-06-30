const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth`;

// ================= LOGIN =================
export const loginUser = async (data: { email: string; password: string }) => {
  console.log("📤 [LOGIN]:", data.email);

  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log("📡 [LOGIN STATUS]:", res.status);
  console.log("📥 [LOGIN RESPONSE]:", result);

  if (!res.ok) throw new Error(result.message || "Login failed");

  return result; // { message, token }
};

// ================= SIGNUP =================
export const signupUser = async (data: any) => {
  console.log("📤 [SIGNUP]:", data.email);

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

  if (!res.ok) throw new Error(result.error || result.message || "Failed to send OTP");

  return result;
};

// ================= RESEND OTP =================
export const resendOtp = async (email: string) => {
  console.log("📤 [RESEND OTP]:", email);

  const res = await fetch(`${BASE_URL}/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email }),
  });

  const result = await res.json();
  console.log("📡 [RESEND OTP STATUS]:", res.status);

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

  return result; // { message, token }
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async (idToken: string) => {
  console.log("📤 [GOOGLE LOGIN]");

  const res = await fetch(`${BASE_URL}/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idToken,
    }),
  });

  const result = await res.json();

  console.log("📡 [GOOGLE LOGIN STATUS]:", res.status);
  console.log("📥 [GOOGLE LOGIN RESPONSE]:", result);

  if (!res.ok) {
    throw new Error(result.message || result.error || "Google login failed");
  }

  return result;
};