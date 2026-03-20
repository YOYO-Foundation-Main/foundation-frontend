import AboutHero from "@/components/about/AboutHero";
import AboutStorySection from "@/components/about/AboutStorySection";
import CTASection from "@/components/about/CTASection";
import VolunteersSection from "@/components/about/VolunteersSection";
import BlogSection from "@/components/common/BlogSection";
import ProjectsRegionSection from "@/components/common/ProjectsRegionSection";
import StatsSection from "@/components/common/StatsSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <StatsSection />
      <AboutStorySection/>
      <CTASection />    
      <VolunteersSection />
      <ProjectsRegionSection />
      <BlogSection />
    </>
  );
}