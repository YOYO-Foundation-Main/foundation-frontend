import PageHero from "@/components/common/PageHero";
import ImpactSection from "@/components/campaigns/ImpactSection";
import CampaignCategories from "@/components/campaigns/CampaignCategories";

export default function CampaignsPage() {
  return (
    <div className="bg-[#F5F5F5]">

      <PageHero
        title="United for Good, Strong for Charity"
        breadcrumb="Home > Campaigns"
        description="Libero dictum ut purus ut vel sit egestas..."
      />

      <ImpactSection />
      <CampaignCategories />

    </div>
  );
}