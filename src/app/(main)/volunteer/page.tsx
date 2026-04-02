import VolunteerHero from "@/components/volunteer/VolunteerHero";
import PageHero from "@/components/common/PageHero";
import VolunteerStory from "@/components/volunteer/VolunteerStory";
import VolunteerStats from "@/components/volunteer/VolunteerStats";
import VolunteerForm from "@/components/volunteer/VolunteerForm";
import VolunteersSection from "@/components/volunteer/VolunteersSection";
import BlogSection from "@/components/common/BlogSection";

export default function VolunteerPage() {
  return (
    <div className="bg-[#F5F5F5]">
      <PageHero
        title="United for Good, Strong for Charity"
        breadcrumb="Home > Volunteer"
        description="Libero dictum ut purus ut vel sit egestas..."
      />
      <VolunteerHero />
      <VolunteerStory />
      <VolunteerStats />
      <VolunteerForm />
      {/* <VolunteersSection /> */}
      {/* <BlogSection />  */}
      <VolunteersSection />
    </div>
  );
}
