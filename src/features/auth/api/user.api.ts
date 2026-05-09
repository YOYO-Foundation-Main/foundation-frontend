const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getUserToken();
  if (!token) throw new Error("No authentication token found");

  const isFormData = options.body instanceof FormData;

  return fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });
};

// GET /api/user/my-profile
export const getMyProfile = async () => {
  const res = await authFetch(`${BASE_URL}/api/user/my-profile`, { cache: "no-store" });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch profile");
  return result;
};

// GET /api/user/my-fundraiser
export const getMyFundraisers = async () => {
  const res = await authFetch(`${BASE_URL}/api/user/my-fundraiser`, { cache: "no-store" });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch fundraisers");
  return result;
};

// GET /api/donations/my-donations
export const getMyDonations = async () => {
  try {
    const res = await authFetch(
      `${BASE_URL}/api/donations/my-donations`,
      { cache: "no-store" }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result?.message || "Failed to fetch donations");
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || "Something went wrong");
  }
};

// POST /api/user/upload-profile-image
// FormData: { image: File }
// Returns: { success, message, data: { id, name, email, mobile, profileImage } }
export const uploadProfileImage = async (file: File) => {
  const fd = new FormData();

  // 🔥 FIXED KEY
  fd.append("file", file);

  const res = await authFetch(`${BASE_URL}/api/user/upload-profile-image`, {
    method: "POST",
    body: fd,
  });

  const result = await res.json();
  console.log("📡 [PROFILE IMAGE]:", res.status, result);

  if (!res.ok) throw new Error(result.message || "Failed to upload profile image");

  return result;
};

// POST /api/kyc/uploading
export const uploadUserKyc = async (data: FormData) => {
  const res = await authFetch(`${BASE_URL}/api/kyc/uploading`, { method: "POST", body: data });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to upload KYC");
  return result;
};

// POST /api/campaign-kyc/:campaignId
export const uploadCampaignKyc = async (campaignId: number, data: FormData) => {
  const res = await authFetch(`${BASE_URL}/api/campaign-kyc/${campaignId}`, { method: "POST", body: data });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to upload campaign KYC");
  return result;
};

//  GET /api/campaigns/featured
export const getFeaturedCampaigns = async () => {
  const res = await fetch(`${BASE_URL}/api/campaigns/featured`);
  const data = await res.json();
  return data.data;
};