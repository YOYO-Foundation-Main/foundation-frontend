const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export const donate = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/donations/donate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Donation failed: ${res.status}`);
  }

  return res.json();
};

// 2. CREATE ORDER
export const createOrder = async (donationId: string) => {
  const res = await fetch(`${BASE_URL}/api/donations/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ donationId }),
  });

  if (!res.ok) throw new Error("Order creation failed");
  return res.json();
};

// 3. VERIFY PAYMENT
export const verifyPayment = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/donations/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Verification failed");
  return res.json();
};

// 4. GET DONATION BY ID
export const getDonationById = async (donationId: string) => {
  const res = await fetch(`${BASE_URL}/api/donations/${donationId}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Failed to fetch donation");

  return res.json();
};

// 5. Download Invoice 
export const downloadInvoice = async (donationId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/donations/invoice/${donationId}`
  );

  if (!res.ok) throw new Error("Failed to download invoice");

  return res.blob();
};