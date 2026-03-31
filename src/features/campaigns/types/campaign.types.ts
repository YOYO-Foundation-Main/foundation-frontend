export interface CampaignCause {
    id: number;
    name:string;
    description:string;
    image:string;
    isActive:boolean;
    createdAt: string;
    

}

export interface Campaign {
    id:number;
    title:string;
    description:string;
    image:string;
    location:string;
    goalAmount: number;
    raisedAmount: number;
    causeId: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    cause: CampaignCause;
    status: string; 

}

export interface CampaignResponse {
    campaigns: Campaign[];
    total: number;
    page:number;
    totalPages: number;
}