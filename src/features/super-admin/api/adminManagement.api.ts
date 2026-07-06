import {
  CreateAdminPayload,
  UpdateAdminPayload,
} from "../../super-admin/types/admin.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getAdminToken(): string {
  if (typeof window === "undefined") return "";

  try {
    const stored = localStorage.getItem("admin-auth-storage");

    if (!stored) return "";

    return JSON.parse(stored)?.state?.adminToken || "";
  } catch {
    return "";
  }
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

// ==========================
// GET ALL ADMINS
// ==========================

export const getAdmins = async () => {
  const res = await fetch(`${BASE_URL}/api/admins`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch admins");
  }

  return result;
};

// ==========================
// GET SINGLE ADMIN
// ==========================

export const getAdmin = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

// ==========================
// CREATE ADMIN
// ==========================

export const createAdmin = async (
  payload: CreateAdminPayload
) => {
  const res = await fetch(`${BASE_URL}/api/admins`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

// ==========================
// UPDATE ADMIN
// ==========================

export const updateAdmin = async (
  id: number,
  payload: UpdateAdminPayload
) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

// ==========================
// TOGGLE STATUS
// ==========================

export const toggleAdminStatus = async (
  id: number,
  isActive: boolean
) => {
  const res = await fetch(
    `${BASE_URL}/api/admins/${id}/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        isActive,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};

// ==========================
// DELETE ADMIN
// ==========================

export const deleteAdmin = async (
  id: number
) => {
  const res = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message);
  }

  return result;
};