const BASE_URL = "https://foundationbackendrepo.onrender.com/api/auth";

// ================= SIGNUP =================
export const signupUser = async (data: any) => {
  try {
    console.log("📤 [SIGNUP]:", data);

    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📡 [SIGNUP STATUS]:", res.status);

    const result = await res.json();
    console.log("📥 [SIGNUP RESPONSE]:", result);

    if (!res.ok) throw new Error(result.message);

    return result;
  } catch (err: any) {
    console.error("🔥 SIGNUP ERROR:", err.message);
    throw err;
  }
};

// ================= LOGIN =================
export const loginUser = async (data: any) => {
  try {
    console.log("📤 [LOGIN]:", data);

    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("📡 [LOGIN STATUS]:", res.status);

    const result = await res.json();
    console.log("📥 [LOGIN RESPONSE]:", result);

    if (!res.ok) throw new Error(result.message);

    return result;
  } catch (err: any) {
    console.error("🔥 LOGIN ERROR:", err.message);
    throw err;
  }
};

// ================= SEND OTP =================
export const sendOtp = async (email: string) => {
  try {
    console.log("📤 [SEND OTP]:", email);

    const res = await fetch(`${BASE_URL}/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email, // ✅ IMPORTANT
      }),
    });

    console.log("📡 [SEND OTP STATUS]:", res.status);

    const data = await res.json();
    console.log("📥 [SEND OTP RESPONSE]:", data);

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: any) {
    console.error("🔥 SEND OTP ERROR:", err.message);
    throw err;
  }
};

// ================= VERIFY OTP =================
export const verifyOtp = async (email: string, otp: string) => {
  try {
    console.log("📤 [VERIFY OTP]:", { email, otp });

    const res = await fetch(`${BASE_URL}/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier: email,
        otp,
      }),
    });

    console.log("📡 [VERIFY OTP STATUS]:", res.status);

    const data = await res.json();
    console.log("📥 [VERIFY OTP RESPONSE]:", data);

    if (!res.ok) throw new Error(data.message);

    return data;
  } catch (err: any) {
    console.error("🔥 VERIFY OTP ERROR:", err.message);
    throw err;
  }
};