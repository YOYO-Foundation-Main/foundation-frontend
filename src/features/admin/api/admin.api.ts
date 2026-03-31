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

// ================= ADMIN LOGIN =================
export const adminLogin = async (data: { email: string; password: string }) => {
  console.log("📤 [ADMIN LOGIN]:", data.email);

  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  console.log("📡 [ADMIN LOGIN STATUS]:", res.status);
  console.log("📥 [ADMIN LOGIN RESPONSE]:", result);

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Admin login failed");
  }

  return result;
};

// ================= DASHBOARD STATS =================
// GET /api/admin/dashboard
// { totalUsers, totalCampaigns, activeCampaigns, pendingCampaigns, totalDonors, totalAmount }
export const adminGetDashboard = async () => {
  console.log("📤 [ADMIN DASHBOARD]");

  const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: authHeaders(),
    cache: "no-store",
  });

  const result = await res.json();
  console.log("📡 [ADMIN DASHBOARD STATUS]:", res.status);
  console.log("📥 [ADMIN DASHBOARD RESPONSE]:", result);

  if (!res.ok) throw new Error(result.message || "Failed to fetch dashboard");
  return result;
};

// ================= CAUSES =================
export const adminGetCauses = async () => {
  const res = await fetch(`${BASE_URL}/api/cause`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch causes");
  return res.json();
};

export const adminCreateCause = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/cause`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create cause");
  return result;
};

export const adminUpdateCause = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update cause");
  return result;
};

export const adminDeleteCause = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete cause");
  return res.json();
};

// ================= CAMPAIGNS =================
export const adminGetCampaigns = async () => {
  const res = await fetch(`${BASE_URL}/api/campaigns`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
};

export const adminCreateCampaign = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/campaigns`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create campaign");
  return result;
};

export const adminUpdateCampaign = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update campaign");
  return result;
};

export const adminDeleteCampaign = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete campaign");
  return res.json();
};

// ================= EVENTS =================
export const adminGetEvents = async () => {
  const res = await fetch(`${BASE_URL}/api/events`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export const adminCreateEvent = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create event");
  return result;
};

export const adminUpdateEvent = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update event");
  return result;
};

export const adminDeleteEvent = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
};

// ================= BLOGS =================
export const adminGetBlogs = async () => {
  const res = await fetch(`${BASE_URL}/api/blog`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export const adminCreateBlog = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create blog");
  return result;
};

export const adminUpdateBlog = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update blog");
  return result;
};

export const adminDeleteBlog = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete blog");
  return res.json();
};

// ================= USERS =================
export const adminGetUsers = async () => {
  const res = await fetch(`${BASE_URL}/api/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const adminDeleteUser = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};