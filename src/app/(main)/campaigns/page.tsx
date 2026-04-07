import PageHero from "@/components/common/PageHero";
import ImpactSection from "@/components/campaigns/ImpactSection";
import CampaignCategories from "@/components/campaigns/CampaignCategories";
import CampaignListSection from "@/components/campaigns/CampaignListSection";
import EventsSection from "@/components/campaigns/EventsSection";
import GallerySection from "@/components/campaigns/GallerySection";
import ImpactVideoSection from "@/components/campaigns/ImpactVideoSection";
import BlogSection from "@/components/common/BlogSection";

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
      <CampaignListSection />
      <EventsSection />
      <GallerySection />
      <ImpactVideoSection />
      <BlogSection />


    </div>
  );
}