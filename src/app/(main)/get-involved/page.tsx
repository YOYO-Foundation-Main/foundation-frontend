import HeroSection from "@/components/getInvolved/HeroSection";
import PageHero from "@/components/common/PageHero";
import DivisionSection from "@/components/getInvolved/DivisionSection";
import CoreValuesSection from "@/components/getInvolved/CoreValuesSection";
import ReviewsSection from "@/components/getInvolved/ReviewsSection";
import ActivitiesSection from "@/components/getInvolved/ActivitiesSection";
import JobsSection from "@/components/getInvolved/JobsSections";
import CTASection from "@/components/common/CTASection";
import FAQSection from "@/components/getInvolved/FAQSection";






export default function GetInvolvedPage() {
  return (
    <>
    <PageHero
  title="United for Good, Strong for Charity"
  breadcrumb="Home > Get-involved"
  description="Libero dictum ut purus ut vel sit egestas..."
/>
      <DivisionSection />
      <CoreValuesSection />
      <ReviewsSection />
      <ActivitiesSection />
      <JobsSection />
      <CTASection
  subtitle="Join Our Team"
  title="Become A Volunteer And Create Lasting Change"
/>
    <FAQSection/> 
      
      
    </>
  );
}