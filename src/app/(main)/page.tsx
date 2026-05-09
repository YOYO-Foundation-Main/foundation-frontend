import BlogSection from "@/components/common/BlogSection";
import CausesSection from "@/components/common/CausesSection";
import CampaignSection from "@/app/(main)/campaigns/page"
import FeaturesSection from "@/components/common/FeaturesSection";
import GallerySection from "@/components/common/GallerySection";
import Hero from "@/components/common/Hero";
import PartnersSection from "@/components/common/PartnersSection";
import ProjectsRegionSection from "@/components/common/ProjectsRegionSection";
import StatsSection from "@/components/common/StatsSection";
import TestimonialSection from "@/components/common/TestimonialSection";
import TestimonialsSection from "@/components/common/TestimonialsSlider";
import TransformSection from "@/components/common/TransformSection";
import FeaturedCampBanner from "@/components/common/FeaturedBanner"
export const dynamic = "force-dynamic";


export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCampBanner/>
      <TransformSection />
      <FeaturesSection />
       <CampaignSection/>
      {/* <CausesSection/> */}
      {/* <ProjectsRegionSection /> */}
      <GallerySection />
      <StatsSection />
      <TestimonialSection />
      {/* <BlogSection /> */}
      <TestimonialsSection/>
      <PartnersSection  />
      
    </>
  );
}