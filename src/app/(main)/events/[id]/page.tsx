import { getEventById, getEvents } from "@/features/events/api/event.api";
import { Event } from "@/features/events/types/event.types";
import EventCard from "@/components/events/EventCard";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowLeft, FiShare2, FiHeart } from "react-icons/fi";
import { isValidUrl } from "@/utils/url";




const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

const formatShortDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return `${d.toLocaleString("en-US", { month: "short" }).toUpperCase()} ${d.getDate()} • ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Next.js 15
}) {
  const { id } = await params;

  let event: Event | null = null;
  let related: Event[] = [];

  try {
    event = await getEventById(id);
  } catch (err) {
    return (
      <div className="bg-white pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load event.</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="bg-white pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Event not found.</p>
      </div>
    );
  }

  // Related events
  try {
    const all = await getEvents();
    related = all.filter((e) => e.id !== event!.id).slice(0, 3);
  } catch { /* no related is fine */ }

  const validImage = isValidUrl(event.image);

  return (
    <div className="bg-white pt-[72px] min-h-screen">

      {/* ── HERO with image ── */}
      <div className="relative h-[360px] bg-gray-900 overflow-hidden">
        {validImage ? (
          <Image
            src={event.image || "/assets/placeholder.png"}
            alt={event.title}
            fill
            className="object-cover opacity-60"
            priority
          />) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#D2252B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
              Live Event
            </span>
            {event.cause?.name && (
              <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/30">
                {event.cause.name}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            {event.title}
          </h1>
          <p className="text-white/70 text-sm">
            Hosted by <span className="text-white font-semibold">{event.creator?.name || "YOYO Foundation"}</span>
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Back */}
            <Link href="/events" className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition -mt-2">
              <FiArrowLeft size={14} /> Back to Events
            </Link>

            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Event</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{event.description}</p>
            </div>

            {/* Event Agenda — placeholder since API doesn't have this */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Agenda</h2>
              <div className="space-y-4">
                {[
                  { time: "09:00 AM — 10:30 AM", title: "Opening Session", desc: "Welcome address and introduction to the event goals and key highlights." },
                  { time: "11:00 AM — 01:00 PM", title: "Main Workshop", desc: "Hands-on session with experts and community leaders." },
                  { time: "02:30 PM — 04:00 PM", title: "Panel Discussion", desc: "Open discussion with speakers and Q&A from attendees." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-[#D2252B] mt-2 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#D2252B] mb-1">{item.time}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Who's attending */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Who's attending?</h2>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full bg-[#D2252B] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    +42
                  </div>
                </div>
                <p className="text-sm text-gray-500">Join change-makers from across the globe.</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Event Info + Register */}
          <div className="space-y-4">

            {/* Date & Location card */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <FiCalendar size={18} className="text-[#D2252B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-800">{formatDate(event.eventDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <FiMapPin size={18} className="text-[#D2252B]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Location</p>
                  <p className="text-sm font-semibold text-gray-800">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Register card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Select Tickets</h3>

              {[
                { label: "General Admission", price: "Free", selected: true },
                { label: "Supporter", price: "₹500" },
                { label: "Sponsor", price: "₹2,000" },
              ].map((ticket) => (
                <label key={ticket.label} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 cursor-pointer hover:border-[#D2252B] transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${ticket.selected ? "border-[#D2252B]" : "border-gray-300"
                      }`}>
                      {ticket.selected && <div className="w-2 h-2 rounded-full bg-[#D2252B]" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{ticket.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${ticket.price === "Free" ? "text-green-500" : "text-gray-800"}`}>
                    {ticket.price}
                  </span>
                </label>
              ))}

              <button className="w-full bg-[#D2252B] hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition mt-2">
                REGISTER NOW
              </button>
              <p className="text-[10px] text-gray-400 text-center">Limited spots available.</p>
            </div>

            {/* Share */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              <span className="text-sm text-gray-600 font-medium">Spread the Impact</span>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-[#D2252B] transition">
                  <FiShare2 size={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-red-500 transition">
                  <FiHeart size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED EVENTS ── */}
      {related.length > 0 && (
        <div className="bg-[#F5F5F5] border-t border-gray-100 py-12">
          <div className="max-w-5xl mx-auto px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Related Events</h2>
                <p className="text-sm text-gray-500 mt-1">Continue your journey of impact with these upcoming sessions.</p>
              </div>
              <Link href="/events" className="text-sm font-semibold text-[#D2252B] hover:underline flex items-center gap-1">
                View All Events →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((e) => (
                <EventCard
                  key={e.id}
                  id={e.id}
                  title={e.title}
                  date={formatShortDate(e.eventDate)}
                  location={e.location}
                  image={e.image}
                  description={e.description}
                  cause={e.cause?.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}