import BlogSection from "@/components/common/BlogSection";
import PageHero from "@/components/common/PageHero";
import ProjectsRegionSection from "@/components/common/ProjectsRegionSection";
import EventGrid from "@/components/events/EventGrid";

export default function EventsPage() {
  return (
    <div className=" bg-[#F5F5F5]">
      <PageHero
        title="Checkout our upcoming full event list"
        breadcrumb="Home > Event Page"
        description="Libero dictum ut purus ut vel sit egestas..."
      />

      <EventGrid />
      <ProjectsRegionSection />
      <BlogSection />
    </div>
  );
}