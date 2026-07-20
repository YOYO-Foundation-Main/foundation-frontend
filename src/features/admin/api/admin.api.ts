const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// function getAdminToken(): string {
//   if (typeof window === "undefined") return "";
//   try {
//     const stored = localStorage.getItem("admin-auth-storage");
//     if (!stored) return "";
//     return JSON.parse(stored)?.state?.adminToken || "";
//   } catch {
//     return "";
//   }
// }

// function authHeaders() {
//   return {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${getAdminToken()}`,
//   };
// }

// ================= ADMIN LOGIN =================
export const adminLogin = async (data: { email: string; password: string }) => {
  console.log("📤 [ADMIN LOGIN]:", data.email);

  const res = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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

//admin logout
export const adminLogout = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};

// ================= DASHBOARD STATS =================
// GET /api/admin/dashboard
// { totalUsers, totalCampaigns, activeCampaigns, pendingCampaigns, totalDonors, totalAmount }
export const adminGetDashboard = async () => {
  console.log("📤 [ADMIN DASHBOARD]");

  const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    credentials: "include",
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
  const res = await fetch(`${BASE_URL}/api/cause/admin`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch causes");

  return res.json();
};

export const adminCreateCause = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/cause/create`, {
    method: "POST",
    credentials: "include",
    body: data,
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to create cause");

  return result;
};

export const adminUpdateCause = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}`, {
    method: "PUT",
   credentials: "include",
    body: data,
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to update cause");

  return result;
};

export const adminDeleteCause = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to delete cause");

  return result;
};

export const adminToggleCauseStatus = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}/toggle`, {
    method: "PATCH",
   credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to toggle status");

  return result;
};

// ================= CAMPAIGNS =================
// export const adminGetCampaigns = async () => {
//   let page = 1;
//   const limit = 100;

//   let allCampaigns: any[] = [];
//   let totalPages = 1;

//   do {
//     const res = await fetch(
//       `${BASE_URL}/api/campaigns?page=${page}&limit=${limit}`,
//       {
//         headers: authHeaders(),
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch campaigns");
//     }

//     const result = await res.json();

//     allCampaigns.push(...(result.campaigns || []));

//     totalPages = result.totalPages;

//     page++;

//   } while (page <= totalPages);

//   return {
//     campaigns: allCampaigns,
//     total: allCampaigns.length,
//   };
// };
export const adminGetCampaigns = async (
  page = 1,
  limit = 10
) => {
  const res = await fetch(
    `${BASE_URL}/api/campaigns?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch campaigns");
  }

  return res.json();
};

export const adminCreateCampaign = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/campaigns`, {
    method: "POST",
   credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create campaign");
  return result;
};

export const adminUpdateCampaign = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}`, {
    method: "PUT",
    credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update campaign");
  return result;
};

export const adminAddCampaignProducts = async (data: {
  campaignId: number;
  products: {
    productId: number;
    quantity: number;
  }[];
}) => {
  const res = await fetch(`${BASE_URL}/api/campaign/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to add products");
  }

  return result;
};

export const adminUpdateCampaignStatus = async (id: number, status: string) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");

  return result;
};

export const adminUpdateFeaturedStatus = async (id: number, status: boolean) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}/featured`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      credentials: "include",
    },
    body: JSON.stringify({ isFeatured: status }), // ✅ FIXED KEY
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");

  return result;
};


export const adminDeleteCampaign = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/campaigns/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete campaign");
  return res.json();
};

// ================= EVENTS =================
export const adminGetEvents = async () => {
  const res = await fetch(`${BASE_URL}/api/events`,
     {credentials: "include", });
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export const adminCreateEvent = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
   credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create event");
  return result;
};

export const adminUpdateEvent = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "PUT",
   credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update event");
  return result;
};

export const adminDeleteEvent = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete event");
  return res.json();
};

//-------------------DONATIONS--------------

export const getDonations = async (params: any) => {
  const query = new URLSearchParams(params).toString();

  const res = await fetch(`${BASE_URL}/api/admin/donations?${query}`, {
    credentials: "include",
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch donations");
  }

  return result;
};

export const getDonationStats = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/donations/stats`, {
   credentials: "include",
    cache: "no-store",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch stats");
  }

  return result;
};

// 🔹 Donor Donations
export const getDonorDonations = async (userId: number) => {
  const res = await fetch(`${BASE_URL}/api/admin/donor/${userId}/donations`, {
    credentials: "include",
    cache: "no-store",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// 🔹 Top Donors
export const getTopDonors = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/top-donors`, {
   credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// 🔹 Campaign Analytics
export const getCampaignAnalytics = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/admin/campaign/${id}/analytics`, {
    credentials: "include",
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message);
  return result;
};

// ================= BLOGS =================
export const adminGetBlogs = async () => {
  const res = await fetch(`${BASE_URL}/api/blog`, { credentials: "include", });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

export const adminCreateBlog = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/blog/create`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create blog");
  return result;
};

export const adminUpdateBlog = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    method: "PUT",
   credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update blog");
  return result;
};

export const adminDeleteBlog = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete blog");
  return res.json();
};

// ================= USERS =================

type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "topDonors" | "engagement" | "recent";
};

export const adminGetUsers = async (params: GetUsersParams = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.append("page", String(params.page));
  if (params.limit) query.append("limit", String(params.limit));
  if (params.search) query.append("search", params.search);
  if (params.sortBy) query.append("sortBy", params.sortBy);

  const res = await fetch(
    `${BASE_URL}/api/admin/users?${query.toString()}`,
    {
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to fetch users");

  return result;
};

export const adminGetUserById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/admin/users/${id}`, {
   credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Failed to fetch user");

  return result;
};

// ================= PRODUCTS =================


export const adminGetProducts = async () => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json(); // { success: true, Products: [...] }
};


export const adminCreateProduct = async (data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create product");
  return result;
};

export const adminUpdateProduct = async (id: number, data: FormData) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "PUT",
   credentials: "include",
    body: data,
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update product");
  return result;
};

export const adminDeleteProduct = async (id: number) => {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: "DELETE",
   credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
};

// ================= PRODUCT CATEGORIES =================

// Get All Categories
export const adminGetProductCategories =
  async () => {

    const res = await fetch(
      `${BASE_URL}/api/product-categories`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch categories"
      );
    }

    return res.json();
  };


// Get Single Category
export const adminGetProductCategoryById =
  async (id: number) => {

    const res = await fetch(
      `${BASE_URL}/api/product-categories/${id}`,
      {
       credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(
        "Failed to fetch category"
      );
    }

    return res.json();
  };


// Create Category
export const adminCreateProductCategory =
  async (data: FormData) => {

    const res = await fetch(
      `${BASE_URL}/api/product-categories`,
      {
        method: "POST",
        credentials: "include",
        body: data,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to create category"
      );
    }

    return result;
  };


// Update Category
export const adminUpdateProductCategory =
  async (
    id: number,
    data: FormData
  ) => {

    const res = await fetch(
      `${BASE_URL}/api/product-categories/${id}`,
      {
        method: "PUT",
        credentials: "include",
        body: data,
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to update category"
      );
    }

    return result;
  };


// Delete Category
export const adminDeleteProductCategory =
  async (id: number) => {

    const res = await fetch(
      `${BASE_URL}/api/product-categories/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to delete category"
      );
    }

    return result;
  };



// ================= KYC (paste these at the bottom of admin.api.ts) =================

// GET /api/kyc/admin — all user/campaigner KYC submissions
export const adminGetUserKyc = async () => {
  const res = await fetch(`${BASE_URL}/api/kyc/admin`, {
   credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user KYC");
  return res.json();
};

// PUT /api/kyc/admin/:id — approve or reject a user KYC
// body: { status: "APPROVED" | "REJECTED", remarks?: string }
export const adminUpdateUserKyc = async (id: number, status: string, remarks?: string) => {
  const res = await fetch(`${BASE_URL}/api/kyc/admin/${id}`, {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({ status, ...(remarks ? { remarks } : {}) }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update KYC");
  return result;
};

// GET /api/campaign-kyc/admin — all campaign/beneficiary KYC submissions
export const adminGetCampaignKyc = async () => {
  const res = await fetch(`${BASE_URL}/api/campaign-kyc/admin`, {
   credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch campaign KYC");
  return res.json();
};

// PUT /api/campaign-kyc/admin/:id — approve or reject a campaign KYC
// body: { status: "APPROVED" | "REJECTED", remarks?: string }
export const adminUpdateCampaignKyc = async (id: number, status: string, remarks?: string) => {
  const res = await fetch(`${BASE_URL}/api/campaign-kyc/admin/${id}`, {
    method: "PUT",
   credentials: "include",
    body: JSON.stringify({ status, ...(remarks ? { remarks } : {}) }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update campaign KYC");
  return result;
};

//contact query api 
export const getContactQueries = async () => {
  const res = await fetch(`${BASE_URL}/api/contact`, {
   credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch contact queries");

  return res.json();
};


//NGOs 
export const getAllNgos = async () => {
  const res = await fetch(`${BASE_URL}/api/ngo/admin/ngos`,
    {
     credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to fetch NGOs"
    );
  }

  return result;
};

export const getNgoById = async (
  id: number
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo/admin/ngos/${id}`,
    {
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to fetch NGO"
    );
  }

  return result;
};

export const approveNgo = async (
  id: number
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo/admin/ngos/${id}/approve`,
    {
      method: "PUT",
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to approve NGO"
    );
  }

  return result;
};

export const rejectNgo = async (
  id: number,
  rejectionReason: string
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo/admin/ngos/${id}/reject`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        rejectionReason,
      }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to reject NGO"
    );
  }

  return result;
};


// =====================================
// VOLUNTEERS
// =====================================

export const getAllVolunteers = async (
  page = 1,
  limit = 10,
  search = "",
  status = ""
) => {

  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const res = await fetch(
    `${BASE_URL}/api/volunteers/admin?${params.toString()}`,
    {
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      "Failed to fetch volunteers"
    );
  }

  return result;
};

export const getVolunteerById =
  async (id: number) => {

    const res = await fetch(
      `${BASE_URL}/api/volunteers/admin/${id}`,
      {
       credentials: "include",
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to fetch volunteer"
      );
    }

    return result;
  };

export const updateVolunteerStatus =
  async (
    id: number,
    status:
      | "PENDING"
      | "APPROVED"
      | "REJECTED"
  ) => {

    const res = await fetch(
      `${BASE_URL}/api/volunteers/admin/${id}/status`,
      {
        method: "PATCH",

       credentials: "include",

        body: JSON.stringify({
          status,
        }),
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to update volunteer"
      );
    }

    return result;
  };

export const getVolunteerStats =
  async () => {

    const res = await fetch(
      `${BASE_URL}/api/volunteers/admin/stats`,
      {
       credentials: "include",
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to fetch stats"
      );
    }

    return result.data;
  };

export const deleteVolunteer =
  async (id: number) => {

    const res = await fetch(
      `${BASE_URL}/api/volunteers/admin/${id}`,
      {
        method: "DELETE",

       credentials: "include",
      }
    );

    const result =
      await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to delete volunteer"
      );
    }

    return result;
  };

// ================= GALLERY =================

// Get All Gallery
export const adminGetGallery = async () => {
  const res = await fetch(`${BASE_URL}/api/gallery`, {
   credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch gallery");
  }

  return res.json();
};

// Create Gallery
export const adminCreateGallery = async (
  data: FormData
) => {
  const res = await fetch(
    `${BASE_URL}/api/gallery`,
    {
      method: "POST",
      credentials: "include",
      body: data,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      "Failed to create gallery"
    );
  }

  return result;
};

// Update Gallery
export const adminUpdateGallery = async (
  id: number,
  data: FormData
) => {
  const res = await fetch(
    `${BASE_URL}/api/gallery/${id}`,
    {
      method: "PUT",
     credentials: "include",
      body: data,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message || "Failed to update gallery"
    );
  }

  return result;
};

// Delete Gallery
export const adminDeleteGallery = async (
  id: number
) => {
  const res = await fetch(
    `${BASE_URL}/api/gallery/${id}`,
    {
      method: "DELETE",
     credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      "Failed to delete gallery"
    );
  }

  return result;
};

// Delete Single Gallery Image
export const adminDeleteGalleryImage = async (
  imageId: number
) => {
  const res = await fetch(
    `${BASE_URL}/api/gallery/image/${imageId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      result.message ||
      "Failed to delete image"
    );
  }

  return result;
};

//featured Gallery

export const adminToggleFeaturedGallery =
  async (id: number) => {
    const res = await fetch(
      `${BASE_URL}/api/gallery/${id}/feature`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(
        result.message ||
        "Failed to update feature status"
      );
    }

    return result;
  };
