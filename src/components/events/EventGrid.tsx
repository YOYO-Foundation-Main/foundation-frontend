import EventCard from "./EventCard";

const events = [
  {
    title: "Transforming Lives Charity Golf Tournament & Networking Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event1.jpg",
  },
  {
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event2.jpg",
  },
  {
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event3.jpg",
  },
  {
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event1.jpg",
  },
  {
    title: "Transforming Lives Charity Golf Tournament & Networking Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event2.jpg",
  },
];

export default function EventGrid() {
  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT BIG */}
          <div className="md:col-span-2">
            <EventCard {...events[0]} size="large" />
          </div>

          {/* RIGHT STACK */}
          <div className="flex flex-col gap-6">
            <EventCard {...events[1]} />
            <EventCard {...events[2]} />
          </div>

          {/* BOTTOM LEFT SMALL */}
          <EventCard {...events[3]} />

          {/* BOTTOM RIGHT BIG */}
          <div className="md:col-span-2">
            <EventCard {...events[4]} size="large" />
          </div>

        </div>
      </div>
    </section>
  );
}