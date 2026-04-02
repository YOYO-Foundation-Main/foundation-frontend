export interface CampaignCause {
  id: number;
  name: string;
  description: string;
  image: string | null;
  isActive: boolean;
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
}

export interface CampaignResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  totalPages: number;
}