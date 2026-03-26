import HeroSection from "@/components/getInvolved/HeroSection";
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
      <HeroSection />
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