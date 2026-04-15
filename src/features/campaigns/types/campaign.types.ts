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

export interface CampaignDonation {
  id: string;
  userId: number;
  campaignId: number;
  amount: number;
  status: string; // "PENDING" | "COMPLETED" | "FAILED"
  donorName: string;
  donorEmail: string;
  donorMobile: string;
  isAnonymous: boolean;
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
  status: string;
  createdBy?: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  cause: CampaignCause;
  donations?: CampaignDonation[];
  campaignProducts?: CampaignProduct[];
}

export interface CampaignResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  totalPages: number;
}