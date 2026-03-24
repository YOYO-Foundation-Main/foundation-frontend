import Image from "next/image";

interface Event {
  id: number;
  title: string;
  location: string;
  description: string;
  date: string;
  image: string;
}

export default function EventsSection() {
  const events: Event[] = [
    {
      id: 1,
      title: "Walk For Clean Water",
      location: "Central Park, New York",
      description: "A community walk to raise funds for clean water.",
      date: "Monday, April 15, 2024",
      // Using cr1.jpg as per original, but repeated cr4.jpg for others to match UI placeholder pattern
      image: "/assets/cr1.jpg",
    },
    {
      id: 2,
      title: "Youth Leadership Summit",
      location: "London, UK",
      description:
        "Empowering youth to lead impactful community initiatives.",
      date: "Monday, June 10, 2024",
      image: "/assets/cr4.jpg", // repeated as per UI consistency
    },
    {
      id: 3,
      title: "Women's Rights Forum",
      location: "Nairobi, Kenya",
      description:
        "Discussing global strategies for women's empowerment.",
      date: "Thursday, August 22, 2024",
      image: "/assets/cr4.jpg", // repeated
    },
    {
      id: 4,
      title: "Disaster Relief Gala",
      location: "Sydney, Australia",
      description:
        "A charity gala to support disaster recovery programs.",
      date: "Saturday, October 5, 2024",
      image: "/assets/cr4.jpg", // repeated
    },
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-12">
          <div>
            <p className="text-[#D2252B] text-sm font-medium mb-2 tracking-wide">
              Our Events
            </p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              Join Our Upcoming <br /> Charity Events
            </h2>
          </div>

          <button className="bg-[#D2252B] hover:bg-[#b81e24] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm inline-flex items-center gap-1 self-start sm:self-auto">
            See All Events
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* EVENTS GRID */}
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-10">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex gap-5 border-b border-gray-100 pb-6 group"
            >
              {/* IMAGE */}
              <div className="relative w-36 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 144px, 144px"
                />

                {/* DATE TAG - positioned bottom left like UI */}
                <span className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-medium px-2 py-1 rounded shadow-sm">
                  {event.date}
                </span>
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-0.5">
                  {event.title}
                </h3>

                <p className="text-sm text-gray-500 mb-1.5 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </p>

                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {event.description}
                </p>

                <button className="mt-3 border border-gray-300 bg-white px-4 py-1.5 text-xs font-medium rounded-full text-gray-700 hover:bg-[#D2252B] hover:text-white hover:border-[#D2252B] transition-all duration-200 shadow-sm">
                  Sign Up
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}