import EventCard from "./EventCard";
import { getEvents } from "@/features/events/api/event.api";
import { Event } from "@/features/events/types/event.types";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()} • ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-gray-500">No events available at the moment.</p>
        </div>
      </section>
    );
  }

  const [first, ...rest] = events;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-8 space-y-6">

        {/* Featured first event — full width */}
        <EventCard
          id={first.id}
          title={first.title}
          date={formatDate(first.eventDate)}
          location={first.location}
          image={first.image}
          description={first.description}
          cause={first.cause?.name}
          featured={true}
        />

        {/* Rest — 3 column grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rest.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={formatShortDate(event.eventDate)}
                location={event.location}
                image={event.image}
                description={event.description}
                cause={event.cause?.name}
              />
            ))}
          </div>
        )}

        {/* Load more button */}
        <div className="text-center pt-4">
          <button className="flex items-center gap-2 mx-auto text-sm font-semibold text-gray-600 hover:text-gray-900 transition">
            Load More Events
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
}