import { FinanceOverviewResponse } from "../types/finance.types";

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

// ===============================
// Finance Overview
// ===============================

export const getFinanceOverview =
  async (): Promise<FinanceOverviewResponse> => {
    const res = await fetch(
      `${BASE_URL}/api/admin/finance/overview`,
      {
        headers: authHeaders(),
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch finance overview");
    }

    return result;
  };

// ================= REVENUE TREND =================
export const getRevenueTrend = async () => {
  const res = await fetch(
    `${BASE_URL}/api/admin/finance/revenue-trend`,
    {
      headers: authHeaders(),
      cache: "no-store",
    }
  );

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch revenue trend");
  }

  return result;
};

// ================= DONATION ANALYTICS =================
export const getDonationAnalytics = async () => {
  const res = await fetch(
    `${BASE_URL}/api/admin/finance/donation-analytics`,
    {
      headers: authHeaders(),
      cache: "no-store",
    }
  );

  const result = await res.json();

  if (!res.ok || !result.success) {
    throw new Error(result.message || "Failed to fetch donation analytics");
  }

  return result;
};

// ================= TOP REVENU CAMPAIGN ANALYTICS =================
export const getTopCampaigns = async () => {
  const res = await fetch(
    `${BASE_URL}/api/admin/finance/top-campaigns`,
    {
      headers: authHeaders(),
      cache: "no-store",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch top campaigns");
  }

  return result;
};