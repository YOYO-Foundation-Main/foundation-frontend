// "use client";

// import { useEffect, useState } from "react";
// import {
//   createAdmin,
//   updateAdmin,
// } from "../api/adminManagement.api";
// import {
//   Admin,
//   CreateAdminPayload,
//   UpdateAdminPayload,
// } from "../types/admin.types";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   mode: "create" | "edit";
//   admin?: Admin | null;
// };

// export default function AdminFormModal({
//   open,
//   onClose,
//   onSuccess,
//   mode,
//   admin,
// }: Props) {
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     password: "",
//     confirmPassword: "",
//   });

//   useEffect(() => {
//     if (mode === "edit" && admin) {
//       setForm({
//         name: admin.name,
//         email: admin.email,
//         mobile: admin.mobile,
//         password: "",
//         confirmPassword: "",
//       });
//     } else {
//       setForm({
//         name: "",
//         email: "",
//         mobile: "",
//         password: "",
//         confirmPassword: "",
//       });
//     }
//   }, [admin, mode, open]);

//   if (!open) return null;

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       if (mode === "create") {
//         const payload: CreateAdminPayload = {
//           name: form.name,
//           email: form.email,
//           mobile: form.mobile,
//           password: form.password,
//           confirmPassword: form.confirmPassword,
//         };

//         await createAdmin(payload);
//       } else {
//         const payload: UpdateAdminPayload = {
//           name: form.name,
//           email: form.email,
//           mobile: form.mobile,
//         };

//         await updateAdmin(admin!.id, payload);
//       }

//       onSuccess();
//       onClose();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">

//       <div className="bg-white rounded-xl w-full max-w-lg p-6">

//         <h2 className="text-2xl font-bold mb-6">
//           {mode === "create" ? "Create Admin" : "Edit Admin"}
//         </h2>

//         <div className="space-y-4">

//           {/* Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-sm font-medium text-gray-700 mb-1.5"
//             >
//               Name
//             </label>

//             <input
//               id="name"
//               name="name"
//               placeholder="Enter admin name"
//               value={form.name}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 mb-1.5"
//             >
//               Email
//             </label>

//             <input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="Enter admin email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {/* Mobile */}
//           <div>
//             <label
//               htmlFor="mobile"
//               className="block text-sm font-medium text-gray-700 mb-1.5"
//             >
//               Mobile Number
//             </label>

//             <input
//               id="mobile"
//               name="mobile"
//               type="tel"
//               placeholder="+919876543210"
//               value={form.mobile}
//               onChange={handleChange}
//               className="w-full border rounded-lg px-4 py-3"
//             />
//           </div>

//           {mode === "create" && (
//             <>
//               {/* Password */}
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium text-gray-700 mb-1.5"
//                 >
//                   Password
//                 </label>

//                 <input
//                   id="password"
//                   type="password"
//                   name="password"
//                   placeholder="Enter password"
//                   value={form.password}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>

//               {/* Confirm Password */}
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block text-sm font-medium text-gray-700 mb-1.5"
//                 >
//                   Confirm Password
//                 </label>

//                 <input
//                   id="confirmPassword"
//                   type="password"
//                   name="confirmPassword"
//                   placeholder="Re-enter password"
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   className="w-full border rounded-lg px-4 py-3"
//                 />
//               </div>
//             </>
//           )}

//         </div>

//         <div className="flex justify-end gap-3 mt-6">

//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg border"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
//           >
//             {loading
//               ? "Saving..."
//               : mode === "create"
//                 ? "Create Admin"
//                 : "Update Admin"}
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import {
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiPhone,
  FiUser,
  FiUserPlus,
  FiEdit2,
  FiX,
} from "react-icons/fi";
import {
  createAdmin,
  updateAdmin,
} from "../api/adminManagement.api";
import {
  Admin,
  CreateAdminPayload,
  UpdateAdminPayload,
} from "../types/admin.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: "create" | "edit";
  admin?: Admin | null;
};

type FormState = {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  mobile: "",
  password: "",
  confirmPassword: "",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState, mode: "create" | "edit"): FormErrors {
  const errors: FormErrors = {};
  if (form.name.trim().length < 2) errors.name = "Enter the admin's full name";
  if (!EMAIL_RE.test(form.email.trim())) errors.email = "Enter a valid email address";
  if (form.mobile.replace(/\D/g, "").length < 10) errors.mobile = "Enter a valid mobile number";
  if (mode === "create") {
    if (form.password.length < 8) errors.password = "Use at least 8 characters";
    if (form.confirmPassword !== form.password) errors.confirmPassword = "Passwords do not match";
  }
  return errors;
}

function passwordScore(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["bg-gray-200", "bg-red-500", "bg-amber-500", "bg-emerald-400", "bg-emerald-600"];

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
  error?: string;
  right?: ReactNode;
};

function Field({ label, icon, error, right, id, ...rest }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
        {label}
      </label>
      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-3.5 transition-colors focus-within:ring-2 ${
          error
            ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
            : "border-gray-200 focus-within:border-red-500 focus-within:ring-red-100"
        }`}
      >
        <span className={error ? "text-red-500" : "text-gray-400"}>{icon}</span>
        <input
          id={id}
          {...rest}
          className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
        />
        {right}
      </div>
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SectionLabel({ index, title, hint }: { index: string; title: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-xs font-bold tabular-nums text-red-600">{index}</span>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {hint ? <p className="text-xs text-gray-500">{hint}</p> : null}
      </div>
    </div>
  );
}

export default function AdminFormModal({
  open,
  onClose,
  onSuccess,
  mode,
  admin,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (mode === "edit" && admin) {
      setForm({
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile,
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setSubmitted(false);
    setServerError("");
    setShowPassword(false);
    setShowConfirm(false);
  }, [admin, mode, open]);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  const errors = useMemo(() => validate(form, mode), [form, mode]);
  const score = passwordScore(form.password);

  if (!open) return null;

  const isCreate = mode === "create";
  const shown: FormErrors = submitted ? errors : {};
  const passwordsMatch = form.confirmPassword.length > 0 && form.confirmPassword === form.password;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (serverError) setServerError("");
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      setServerError("");

      if (isCreate) {
        const payload: CreateAdminPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
        };

        await createAdmin(payload);
      } else {
        const payload: UpdateAdminPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
        };

        await updateAdmin(admin!.id, payload);
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Admin save failed:", err);
      setServerError(err instanceof Error && err.message ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const eyeButton = (isVisible: boolean, toggle: () => void) => (
    <button
      type="button"
      onClick={toggle}
      tabIndex={-1}
      className="rounded-md p-1 text-gray-400 transition-colors hover:text-red-600"
      aria-label={isVisible ? "Hide password" : "Show password"}
    >
      {isVisible ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={isCreate ? "Create admin" : "Edit admin"}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/60 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:max-w-lg ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="border-t-4 border-red-600 px-6 pb-5 pt-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white">
                {isCreate ? <FiUserPlus className="h-6 w-6" /> : <FiEdit2 className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
                  {isCreate ? "Create Admin" : "Edit Admin"}
                </h2>
                <p className="text-sm text-gray-500">
                  {isCreate ? "Give a teammate access to the admin panel." : "Update this administrator's details."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
              aria-label="Close"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-8 overflow-y-auto border-t border-gray-100 px-6 py-6 sm:px-8">
          {serverError ? (
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{serverError}</span>
            </div>
          ) : null}

          <section className="space-y-5">
            <SectionLabel index="01" title="Profile" hint="How this admin appears across the platform" />
            <Field
              id="name"
              name="name"
              label="Full name"
              icon={<FiUser className="h-4 w-4" />}
              placeholder="Enter admin name"
              value={form.name}
              onChange={handleChange}
              error={shown.name}
              autoComplete="name"
            />
            <Field
              id="email"
              name="email"
              type="email"
              label="Email address"
              icon={<FiMail className="h-4 w-4" />}
              placeholder="Enter admin email"
              value={form.email}
              onChange={handleChange}
              error={shown.email}
              autoComplete="email"
            />
            <Field
              id="mobile"
              name="mobile"
              type="tel"
              label="Mobile number"
              icon={<FiPhone className="h-4 w-4" />}
              placeholder="+919876543210"
              value={form.mobile}
              onChange={handleChange}
              error={shown.mobile}
              autoComplete="tel"
            />
          </section>

          {isCreate ? (
            <section className="space-y-5">
              <SectionLabel index="02" title="Security" hint="Set the password this admin will sign in with" />
              <div>
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  icon={<FiLock className="h-4 w-4" />}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  error={shown.password}
                  autoComplete="new-password"
                  right={eyeButton(showPassword, () => setShowPassword((v) => !v))}
                />
                {form.password ? (
                  <div className="mt-3">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= score ? strengthColors[score] : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-gray-500">
                      Strength: <span className="font-bold text-gray-800">{strengthLabels[score]}</span>
                    </p>
                  </div>
                ) : null}
              </div>
              <div>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  label="Confirm password"
                  icon={<FiLock className="h-4 w-4" />}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  error={shown.confirmPassword}
                  autoComplete="new-password"
                  right={eyeButton(showConfirm, () => setShowConfirm((v) => !v))}
                />
                {passwordsMatch ? (
                  <p className="mt-1.5 text-xs font-medium text-emerald-600">Passwords match</p>
                ) : null}
              </div>
            </section>
          ) : (
            <section className="flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-600">
              <FiLock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <span>Passwords can&apos;t be changed here. Only name, email and mobile are editable.</span>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="grid grid-cols-2 gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : isCreate ? (
              "Create Admin"
            ) : (
              "Update Admin"
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

