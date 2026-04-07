// src/features/campaigns/api/userCampaign.api.ts

import { Campaign } from "../types/campaign.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to get user token - IMPROVED
export const getUserToken = (): string | null => {
  try {
    const stored = localStorage.getItem("auth-storage");
    console.log("Raw stored data:", stored); // Debug log
    
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    console.log("Parsed data:", parsed); // Debug log
    
    // Try different possible token locations
    const token = parsed?.state?.token || parsed?.token || null;
    console.log("Extracted token:", token ? "Token exists" : "No token"); // Debug log
    
    return token;
  } catch (error) {
    console.error("Error getting user token:", error);
    return null;
  }
};

// Check if user is authenticated
export const isUserAuthenticated = (): boolean => {
  const token = getUserToken();
  return !!token;
};

// Create campaign from user side
export const userCreateCampaign = async (formData: FormData): Promise<Campaign> => {
  const token = getUserToken();
  
  console.log("Creating campaign - Token present:", !!token); // Debug log
  
  if (!token) {
    throw new Error("Please login to create a campaign");
  }

  const response = await fetch(`${BASE_URL}/api/campaigns`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || "Failed to create campaign");
  }
  
  return result.data || result;
};