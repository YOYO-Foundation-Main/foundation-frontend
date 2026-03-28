import { Campaign, CampaignResponse} from "../types/campaign.types"

const BASE_URL = process.env.Next_public_API_BASE_URL;


export const getCampaigns = async (): Promise<CampaignResponse> => {
    const res = await fetch(`${BASE_URL}/api/campaigns`,{
        next: {revalidate: 60},

    });
    if (!res.ok) throw new Error(`Failed to fetch campaigns: ${res.status}`);
    return res.json();
};


export const getCampaignById = async (id: string): Promise<Campaign> =>{
    const res = await fetch(`${BASE_URL}/api/campaigns/${id}`,{
        cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch compaign: ${res.status}`);

    const data = await res.json();
    return data?.data || data;
}