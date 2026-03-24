"use client";
import { useState } from "react";
import { signupUser } from "@/features/auth/api/auth.api";

export default function SignupForm({ setStep }: any) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    console.log("👉 SIGNUP CLICK", form);

    try {
      const res = await signupUser(form);

      console.log("✅ SIGNUP SUCCESS:", res);

      alert("Signup successful 🎉");

      // 👉 GO TO LOGIN
      setStep("login");
     alert("Signup done ✅ Now login via OTP");
    } catch (err: any) {
      console.log("❌ SIGNUP ERROR:", err.message);
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
          className="border block mb-2"
        />
      ))}

      <button onClick={handleSignup}>Signup</button>

      <p onClick={() => setStep("login")} className="cursor-pointer">
        Already have account? Login
      </p>
    </div>
  );
}