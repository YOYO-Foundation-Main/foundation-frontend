import { Cause } from "../types/cause.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Get all causes
export const getCauses = async (): Promise<Cause[]> => {
  const res = await fetch(`${BASE_URL}/api/cause`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Failed to fetch causes: ${res.status}`);

  return res.json(); // returns plain array
};

// ✅ Get single cause by ID
export const getCauseById = async (id: string): Promise<Cause> => {
  const res = await fetch(`${BASE_URL}/api/cause/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch cause: ${res.status}`);

  const data = await res.json();

  // handle both direct object or { data: {...} } wrapper
  return data?.data || data;
};