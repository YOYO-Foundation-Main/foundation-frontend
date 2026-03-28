"use client";

import { useEffect, useState } from "react";
import { getCampaigns } from "../api/campaign.api";
import { Campaign } from "../types/campaign.types";

export const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data.campaigns);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return { campaigns, loading, error };
};