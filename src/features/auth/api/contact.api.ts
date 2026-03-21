import { ContactFormData } from "../types/contact.types";

export const sendContactForm = async (data: ContactFormData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
};