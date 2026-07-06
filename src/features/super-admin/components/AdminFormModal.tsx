"use client";

import { useEffect, useState } from "react";
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

export default function AdminFormModal({
  open,
  onClose,
  onSuccess,
  mode,
  admin,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

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
      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [admin, mode, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (mode === "create") {
        const payload: CreateAdminPayload = {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          password: form.password,
          confirmPassword: form.confirmPassword,
        };

        await createAdmin(payload);
      } else {
        const payload: UpdateAdminPayload = {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
        };

        await updateAdmin(admin!.id, payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold mb-6">
          {mode === "create" ? "Create Admin" : "Edit Admin"}
        </h2>

        <div className="space-y-4">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            name="mobile"
            placeholder="+919876543210"
            value={form.mobile}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
          />

          {mode === "create" && (
            <>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3"
              />
            </>
          )}

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            {loading
              ? "Saving..."
              : mode === "create"
              ? "Create Admin"
              : "Update Admin"}
          </button>

        </div>

      </div>

    </div>
  );
}