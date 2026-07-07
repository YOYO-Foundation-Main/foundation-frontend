export interface FinanceOverview {
  totalDonations: number;
  totalDonationAmount: number;
  totalPlatformTips: number;
  totalPaidAmount: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  revenueGrowth: number;
  totalDonors: number;
  totalCampaigns: number;
}

export interface FinanceOverviewResponse {
  success: boolean;
  data: FinanceOverview;
}

export interface FinanceOverview {
  totalDonations: number;
  totalDonationAmount: number;
  totalPlatformTips: number;
  totalPaidAmount: number;
  todayRevenue: number;
  monthRevenue: number;
  yearRevenue: number;
  revenueGrowth: number;
  totalDonors: number;
  totalCampaigns: number;
}

export interface RevenueTrendItem {
  month: string;
  donationAmount: number;
  platformTips: number;
  totalRevenue: number;
  donations: number;
}