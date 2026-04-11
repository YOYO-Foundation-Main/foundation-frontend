// src/features/auth/api/user.api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper to get token from Zustand store
const getUserToken = (): string | null => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token || parsed?.token || null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

// Helper for authenticated fetch requests
const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getUserToken();
  
  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
    },
  });

  return response;
};

// GET /api/user/my-profile
export const getMyProfile = async () => {
  try {
    const res = await authFetch(`${BASE_URL}/api/user/my-profile`, {
      cache: "no-store",
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch profile");
    }
    
    return result;
  } catch (error: any) {
    console.error("❌ getMyProfile error:", error.message);
    throw error;
  }
};

// GET /api/user/my-fundraiser
export const getMyFundraisers = async () => {
  try {
    const res = await authFetch(`${BASE_URL}/api/user/my-fundraiser`, {
      cache: "no-store",
    });
    
    const result = await res.json();
    
    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch fundraisers");
    }
    
    return result;
  } catch (error: any) {
    console.error("❌ getMyFundraisers error:", error.message);
    throw error;
  }
};

// ── KYC: Upload user/campaigner document ─────────────────────────────────────
// POST /api/kyc/uploading
// FormData: { documentType, document, type: "CAMPAIGNER" }
export const uploadUserKyc = async (data: FormData) => {
  try {
    const res = await authFetch(`${BASE_URL}/api/kyc/uploading`, {
      method: "POST",
      body: data,
      // Don't set Content-Type - let browser set it with boundary for FormData
    });
    
    const result = await res.json();
    console.log("📡 [USER KYC]:", res.status, result);
    
    if (!res.ok) {
      throw new Error(result.message || "Failed to upload KYC");
    }
    
    return result;
  } catch (error: any) {
    console.error("❌ uploadUserKyc error:", error.message);
    throw error;
  }
};

// ── KYC: Upload beneficiary document for a campaign ──────────────────────────
// POST /api/campaign-kyc/:campaignId
// FormData: { document, documentType, type: "BENEFICIARY" }
export const uploadCampaignKyc = async (campaignId: number, data: FormData) => {
  try {
    const res = await authFetch(`${BASE_URL}/api/campaign-kyc/${campaignId}`, {
      method: "POST",
      body: data,
    });
    
    const result = await res.json();
    console.log("📡 [CAMPAIGN KYC]:", res.status, result);
    
    if (!res.ok) {
      throw new Error(result.message || "Failed to upload campaign KYC");
    }
    
    return result;
  } catch (error: any) {
    console.error("❌ uploadCampaignKyc error:", error.message);
    throw error;
  }
};  