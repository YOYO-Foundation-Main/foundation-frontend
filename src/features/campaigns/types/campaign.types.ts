// src/features/campaigns/types/campaign.types.ts

export interface CampaignCause {
  id: number;
  name: string;
  description: string;
  image: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CampaignProduct {
  id: number;
  campaignId: number;
  draftId: number | null;
  productId: number;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  totalAmount: number;
  createdAt: string;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  image: string | null;
  location: string;
  goalAmount: number;
  raisedAmount: number;
  causeId: number;
  isActive: boolean;
  status: string; // "APPROVED" | "DRAFT" | "COMPLETED" | "PENDING"
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  cause: CampaignCause;
  campaignProducts?: CampaignProduct[]; // ✅ Added - optional since not all campaigns may have products
  donations?: any[]; // ✅ Added for consistency with API
  createdBy?: number; // ✅ Added
}

export interface CampaignResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  totalPages: number;
}