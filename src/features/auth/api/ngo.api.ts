// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// function getToken(): string {
//   if (typeof window === "undefined") return "";

//   try {
//     const stored = localStorage.getItem("auth-storage");

//     if (!stored) return "";

//     return JSON.parse(stored)?.state?.token || "";
//   } catch {
//     return "";
//   }
// }

// function authHeaders() {
//   return {
//     Authorization: `Bearer ${getToken()}`,
//   };
// }

// // ================= CREATE NGO =================

// export const createNgo = async (data: any) => {
//   const res = await fetch(`${BASE_URL}/api/ngo/create`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(),
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result.message || "Failed to create NGO");
//   }

//   return result;
// };

// // ================= UPLOAD NGO DOCUMENT =================

// export const uploadNgoDocument = async (data: FormData) => {
//   const res = await fetch(`${BASE_URL}/api/ngo/upload-document`, {
//     method: "POST",
//     headers: {
//       ...authHeaders(),
//     },
//     body: data,
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result.message || "Failed to upload document");
//   }

//   return result;
// };

// // ================= ADD REPRESENTATIVE =================

// export const addNgoRepresentative = async (data: any) => {
//   const res = await fetch(`${BASE_URL}/api/ngo/representative`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(),
//     },
//     body: JSON.stringify(data),
//   });

//   const result = await res.json();

//   if (!res.ok) {
//     throw new Error(result.message || "Failed to add representative");
//   }

//   return result;
// };

// // ================= ADD NGO BANK =================

// // export const addNgoBank = async (data: FormData) => {
// //   const res = await fetch(`${BASE_URL}/api/ngo/bank`, {
// //     method: "POST",
// //     headers: {
// //       ...authHeaders(),
// //     },
// //     body: data,
// //   });

// //   const result = await res.json();

// //   if (!res.ok) {
// //     throw new Error(result.message || "Failed to add bank");
// //   }

// //   return result;
// // };

// //NGO API FUNCTION
// export const addNgoBank = async (data: FormData) => {
//   const res = await fetch(`${BASE_URL}/api/ngo/bank`, {
//     method: "POST",
//     headers: {
//       ...authHeaders(),
//     },
//     body: data,
//   });

//   const result = await res.json();

//   console.log("BANK API RESPONSE:", result);

//   if (!res.ok) {
//     throw new Error(
//       result.message || "Failed to add bank"
//     );
//   }

//   return result;
// };

// // ================= SUBMIT NGO =================
// export const submitNgoVerification =
//   async (data: any) => {

//     const res = await fetch(
//       `${BASE_URL}/api/ngo/submit`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...authHeaders(),
//         },
//         body: JSON.stringify(data),
//       }
//     );

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message);
//     }

//     return result;
//   };


//new api end points according to new draft changes in flow 

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

function getToken(): string {
  if (typeof window === "undefined") return "";

  try {
    const stored = localStorage.getItem("auth-storage");
    if (!stored) return "";

    return JSON.parse(stored)?.state?.token || "";
  } catch {
    return "";
  }
}

function authHeaders() {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

// ================= START NGO DRAFT =================
export const startNgoDraft = async () => {
  const res = await fetch(`${BASE_URL}/api/ngo-draft/draft/start`, {
    method: "POST",
    headers: {
      ...authHeaders(),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to start NGO draft");
  }

  return result;
};

// ================= UPDATE BASIC DETAILS =================
export const updateNgoBasicDetails = async (draftId: number, data: any) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}/basic-details`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to update NGO details");
  }

  return result;
};

// ================= UPLOAD DOCUMENT =================
export const uploadNgoDraftDocument = async (
  draftId: number,
  data: FormData
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}/document`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body: data,
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to upload document");
  }

  return result;
};

// ================= ADD REPRESENTATIVE =================
export const addNgoDraftRepresentative = async (
  draftId: number,
  data: any
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}/representative`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to add representative");
  }

  return result;
};

// ================= ADD BANK DETAILS =================
export const addNgoDraftBank = async (
  draftId: number,
  data: FormData
) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}/bank`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
      body: data,
    }
  );

  const result = await res.json();

  console.log("BANK API RESPONSE:", result);

  if (!res.ok) {
    throw new Error(result.message || "Failed to save bank details");
  }

  return result;
};

// ================= SUBMIT NGO (FINAL STEP) =================
export const submitNgoDraft = async (draftId: number) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}/submit`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to submit NGO");
  }

  return result;
};

// ================= GET DRAFT =================
export const getNgoDraft = async (draftId: number) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/draft/${draftId}`,
    {
      method: "GET",
      headers: {
        ...authHeaders(),
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch draft");
  }

  return result;
};

// ================= GET MY DRAFTS =================
export const getMyNgoDrafts = async () => {
  const res = await fetch(`${BASE_URL}/api/ngo-draft/`, {
    method: "GET",
    headers: {
      ...authHeaders(),
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to fetch drafts");
  }

  return result;
};

// ================= DELETE DRAFT =================
export const deleteNgoDraft = async (draftId: number) => {
  const res = await fetch(
    `${BASE_URL}/api/ngo-draft/${draftId}`,
    {
      method: "DELETE",
      headers: {
        ...authHeaders(),
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to delete draft");
  }

  return result;
};