import AboutHero from "@/components/about/AboutHero";
import PageHero from "@/components/common/PageHero";
import AboutStorySection from "@/components/about/AboutStorySection";
import CTASection from "@/components/about/CTASection";
import VolunteersSection from "@/components/about/VolunteersSection";
import BlogSection from "@/components/common/BlogSection";
import ProjectsRegionSection from "@/components/common/ProjectsRegionSection";
import StatsSection from "@/components/common/StatsSection";

export default function AboutPage() {
  return (
    <>
      <PageHero
  title="United for Good, Strong for Charity"
  breadcrumb="Home > About Us"
  description="Libero dictum ut purus ut vel sit egestas..."
/>
      <StatsSection />
      <AboutStorySection/>
      <CTASection />    
      <VolunteersSection />
      <ProjectsRegionSection />
      <BlogSection />
    </>
  );
}