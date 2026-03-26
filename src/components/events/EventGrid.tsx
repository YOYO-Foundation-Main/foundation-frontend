import EventCard from "./EventCard";

const events = [
  {
    id: 1,
    title:
      "Transforming Lives Charity Golf Tournament & Networking Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event1.jpg",
  },
  {
    id: 2,
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event2.jpg",
  },
  {
    id: 3,
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event3.jpg",
  },
  {
    id: 4,
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event4.jpg",
  },
  {
    id: 5,
    title: "Unity in Giving Community Charity Event",
    date: "October 19, 2025",
    location: "135 W, 46nd Street, New York",
    image: "/assets/event5.jpg",
  },
];

export default function EventGrid() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      
      {/* TOP GRID */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        
        {/* LEFT BIG */}
        <div className="md:col-span-2">
          <EventCard {...events[0]} large />
        </div>

        {/* RIGHT STACK */}
        <div className="flex flex-col gap-6">
          <EventCard {...events[1]} />
          <EventCard {...events[2]} />
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        <EventCard {...events[3]} />
        <EventCard {...events[4]} />
      </div>
    </div>
  );
}