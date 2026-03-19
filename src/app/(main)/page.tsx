import CausesSection from "@/components/common/CausesSection";
import FeaturesSection from "@/components/common/FeaturesSection";
import GallerySection from "@/components/common/GallerySection";
import Hero from "@/components/common/Hero";
import ProjectsRegionSection from "@/components/common/ProjectsRegionSection";
import StatsSection from "@/components/common/StatsSection";
import TransformSection from "@/components/common/TransformSection";


export default function HomePage() {
  return (
    <>
      <Hero />
      
      <TransformSection />
      <FeaturesSection />
      <CausesSection/>
      <ProjectsRegionSection />
      <GallerySection />
      <StatsSection />
      
    </>
  );
}