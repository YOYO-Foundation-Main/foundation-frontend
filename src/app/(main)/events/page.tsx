import BlogSection from "@/components/common/BlogSection";
import EventGrid from "@/components/events/EventGrid";
import { FiSearch } from "react-icons/fi";
export const dynamic = "force-dynamic";

export default function EventsPage() {
  return (
    <div className="bg-[#F5F5F5] pt-[72px] min-h-screen">

      {/* Hero */}
      <div className="bg-white px-8 pt-14 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Upcoming Events</h1>
          <p className="text-gray-500 max-w-lg text-sm leading-relaxed">
            Join a community of change-makers. From global webinars to local meetups,
            discover your next opportunity to create measurable impact.
          </p>
        </div>
      </div>

      {/* Search + Filters bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-[72px] z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-end gap-4">

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Search Events</label>
            <div className="relative">
              <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search by title, NGO, or keyword..."
                className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#D2252B] placeholder:text-gray-400 bg-gray-50"
              />
            </div>
          </div>

          {/* Date */}
          <div className="min-w-[140px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Date</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] bg-gray-50 text-gray-600">
              <option>Any Date</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          {/* Type */}
          <div className="min-w-[140px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Type</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] bg-gray-50 text-gray-600">
              <option>All Types</option>
              <option>Webinar</option>
              <option>Workshop</option>
              <option>Meetup</option>
              <option>Conference</option>
            </select>
          </div>

          {/* Category */}
          <div className="min-w-[160px]">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Category</label>
            <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#D2252B] bg-gray-50 text-gray-600">
              <option>All Categories</option>
              <option>Environment</option>
              <option>Education</option>
              <option>Health</option>
              <option>Community</option>
            </select>
          </div>

          {/* Filter icon button */}
          <button className="w-11 h-11 bg-[#D2252B] rounded-xl flex items-center justify-center text-white hover:bg-red-700 transition shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <EventGrid />

      <BlogSection />
    </div>
  );
}