import EventCard from "./EventCard";
import { getEvents } from "@/features/events/api/event.api";
import { Event } from "@/features/events/types/event.types";

export default async function EventGrid() {
  let events: Event[] = [];

  try {
    events = await getEvents();
    console.log("✅ Events loaded:", events.length);
  } catch (err) {
    console.error("❌ EventGrid error:", err);
  }

  if (!events.length) {
    return (
      <section className="bg-[#f5f5f5] py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-500">No events available at the moment.</p>
        </div>
      </section>
    );
  }

  // Format date helper
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {events.length >= 1 && (
            // First event — big left
            <div className="md:col-span-2">
              <EventCard
                title={events[0].title}
                date={formatDate(events[0].eventDate)}
                location={events[0].location}
                image={events[0].image}
                description={events[0].description}
                cause={events[0].cause?.name}
                size="large"
              />
            </div>
          )}

          {/* Right stack — events 2 & 3 */}
          <div className="flex flex-col gap-6">
            {events[1] && (
              <EventCard
                title={events[1].title}
                date={formatDate(events[1].eventDate)}
                location={events[1].location}
                image={events[1].image}
                cause={events[1].cause?.name}
              />
            )}
            {events[2] && (
              <EventCard
                title={events[2].title}
                date={formatDate(events[2].eventDate)}
                location={events[2].location}
                image={events[2].image}
                cause={events[2].cause?.name}
              />
            )}
          </div>

          {/* Bottom left small — event 4 */}
          {events[3] && (
            <EventCard
              title={events[3].title}
              date={formatDate(events[3].eventDate)}
              location={events[3].location}
              image={events[3].image}
              cause={events[3].cause?.name}
            />
          )}

          {/* Bottom right big — event 5 */}
          {events[4] && (
            <div className="md:col-span-2">
              <EventCard
                title={events[4].title}
                date={formatDate(events[4].eventDate)}
                location={events[4].location}
                image={events[4].image}
                cause={events[4].cause?.name}
                size="large"
              />
            </div>
          )}

          {/* Any extra events beyond 5 — shown as small cards */}
          {events.slice(5).map((event) => (
            <EventCard
              key={event.id}
              title={event.title}
              date={formatDate(event.eventDate)}
              location={event.location}
              image={event.image}
              cause={event.cause?.name}
            />
          ))}

        </div>
      </div>
    </section>
  );
}