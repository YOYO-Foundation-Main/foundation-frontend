import { Campaign } from "../types/campaign.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ── Token helper ──────────────────────────────────────────────────────────────
export const getUserToken = (): string | null => {
  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token || parsed?.token || null;
  } catch {
    return null;
  }
};

export const isUserAuthenticated = (): boolean => !!getUserToken();

// ── Step 1: Start draft ───────────────────────────────────────────────────────
// POST /api/campaign-draft/start
export const startCampaignDraft = async (data: {
  name: string;
  email: string;
  mobile: string;
  causeId: number;
}): Promise<{ id: number;[key: string]: any }> => {

  const res = await fetch(`${BASE_URL}/api/campaign-draft/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  console.log("📡 [DRAFT START]:", res.status, result);
  if (!res.ok) throw new Error(result.message || "Failed to start campaign draft");
  return result?.data || result;
};

// campaign send-otp
export const sendCampaignOtp = async (
  identifier: string
): Promise<any> => {
  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/send-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to send OTP");
  }

  return result;
};

//verify otp
export const verifyCampaignOtp = async (
  identifier: string,
  otp: string
): Promise<any> => {
  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/verify-otp`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        identifier,
        otp,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "OTP verification failed");
  }

  return result;
};

//resume draft api
export const resumeCampaignDraft = async (): Promise<any> => {
  const token = getUserToken();

  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/resume`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to resume draft");
  }

  return result.draft;
};

//Update Product Category API
export const updateCampaignProductCategory = async (
  draftId: number,
  productCategoryId: number
): Promise<any> => {

  const token = getUserToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/${draftId}/category`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productCategoryId,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to save category");
  }

  return result.data;
};

// ── Step 2: Update campaign details ──────────────────────────────────────────
// PUT /api/campaign-draft/:id — FormData { title, description, image }
export const updateCampaignDraftDetails = async (draftId: number, data: FormData): Promise<any> => {
  const token = getUserToken();
  if (!token) throw new Error("Please login to continue");

  const res = await fetch(`${BASE_URL}/api/campaign-draft/${draftId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: data,
  });
  const result = await res.json();
  console.log("📡 [DRAFT DETAILS]:", res.status, result);
  if (!res.ok) throw new Error(result.message || "Failed to update campaign details");
  return result?.data || result;
};

// ── Step 3: Update beneficiary ────────────────────────────────────────────────
// export const updateCampaignDraftBeneficiary = async (
//   draftId: number,
//   data: {
//     beneficiaryType: string;

//     ngoId?: string;

//     beneficiaryName?: string;
//     beneficiaryRelation?: string;
//     beneficiaryMobile?: string;
//     beneficiaryCity?: string;
//     beneficiaryState?: string;
//   }
// ): Promise<any> => {
//   const token = getUserToken();
//   if (!token) throw new Error("Please login to continue");

//   const res = await fetch(`${BASE_URL}/api/campaign-draft/${draftId}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify(data),
//   });
//   const result = await res.json();
//   console.log("📡 [DRAFT BENEFICIARY]:", res.status, result);
//   if (!res.ok) throw new Error(result.message || "Failed to update beneficiary");
//   return result?.data || result;
// };
export const updateCampaignDraftBeneficiary = async (
  draftId: number,
  data: {
    beneficiaryType: string;

    ngoId?: string;

    beneficiaryName?: string;
    beneficiaryRelation?: string;
    beneficiaryMobile?: string;
    beneficiaryCity?: string;
    beneficiaryState?: string;
  }
): Promise<any> => {
  const token = getUserToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/${draftId}/beneficiary`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to update beneficiary"
    );
  }

  return result?.data || result;
};


// ── Step 4: Add products to campaign draft ────────────────────────────────────
// POST /api/campaign/products
// Body: { draftId, products: [{ productId, quantity }] }
// export const addCampaignProducts = async (
//   draftId: number,
//   products: { productId: number; quantity: number }[]
// // )
// export const addCampaignProducts = async (
//   draftId: number,
//   products: { productId: number; quantity: number }[],
//   manualGoalAmount?: number
// )
//   : Promise<any> => {
//   const token = getUserToken();
//   if (!token) throw new Error("Please login to continue");

//   const res = await fetch(`${BASE_URL}/api/campaign/products`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//     body: JSON.stringify({ draftId, products, manualGoalAmount}),
//   });
//   const result = await res.json();
//   console.log("📡 [CAMPAIGN PRODUCTS]:", res.status, result);
//   if (!res.ok) throw new Error(result.message || "Failed to add products");
//   return result?.data || result;
// };
// =====================================
// GET PRODUCT CATEGORIES
// =====================================

export const getProductCategories = async (): Promise<any[]> => {
  const res = await fetch(
    `${BASE_URL}/api/product-categories`
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to fetch product categories"
    );
  }

  return result.data;
};

// =====================================
// GET PRODUCTS BY CATEGORY
// =====================================

export const getProductsByCategory = async (
  categoryId: number
): Promise<any[]> => {

  const res = await fetch(
    `${BASE_URL}/api/products/category/${categoryId}`
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to fetch products"
    );
  }

  return result.products;
};


//Update Product API
export const addCampaignProducts = async (
  draftId: number,
  products: {
    productId: number;
    quantity: number;
  }[],
  manualGoalAmount: number

): Promise<any> => {

  const token = getUserToken();

  if (!token) {
    throw new Error("Please login to continue");
  }

  const res = await fetch(
    `${BASE_URL}/api/campaign-draft/${draftId}/funding`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        products,
        manualGoalAmount,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to save products");
  }

  return result.data;
};

// ── Step 5: Submit draft ──────────────────────────────────────────────────────
// POST /api/campaign-draft/:id/submit
export const submitCampaignDraft = async (draftId: number): Promise<any> => {
  const token = getUserToken();
  if (!token) throw new Error("Please login to continue");

  const res = await fetch(`${BASE_URL}/api/campaign-draft/${draftId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const result = await res.json();
  console.log("📡 [DRAFT SUBMIT]:", res.status, result);
  if (!res.ok) throw new Error(result.message || "Failed to submit campaign");
  return result?.data || result;
};

// ── Legacy single-step (kept for backward compat) ─────────────────────────────
export const userCreateCampaign = async (formData: FormData): Promise<Campaign> => {
  const token = getUserToken();
  if (!token) throw new Error("Please login to create a campaign");

  const res = await fetch(`${BASE_URL}/api/campaigns`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create campaign");
  return result.data || result;
};