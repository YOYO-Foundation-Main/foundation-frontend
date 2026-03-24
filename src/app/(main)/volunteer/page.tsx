import VolunteerHero from "@/components/volunteer/VolunteerHero";
import VolunteerStory from "@/components/volunteer/VolunteerStory";
import VolunteerStats from "@/components/volunteer/VolunteerStats";
import VolunteerForm from "@/components/volunteer/VolunteerForm";
import VolunteersSection from "@/components/about/VolunteersSection";
import BlogSection from "@/components/common/BlogSection";

export default function VolunteerPage() {
  return (
    <div className="bg-[#F5F5F5]">
      <VolunteerHero />
      <VolunteerStory />
      <VolunteerStats />
      <VolunteerForm />
      <VolunteersSection />
      <BlogSection /> 
    </div>
  );
}
