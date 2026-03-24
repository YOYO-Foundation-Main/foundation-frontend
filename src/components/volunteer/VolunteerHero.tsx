export default function VolunteerHero() {
  return (
    <div className="border-b border-gray-200 mt-15">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT */}
        <div>
          <p className="text-sm text-[#D2252B] mb-2">
            Become A Volunteer
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-black leading-tight">
            Real Stories Of <br /> Change And Impact
          </h1>
        </div>

        {/* RIGHT */}
        <div>
          <p className="text-gray-500 text-sm max-w-md">
            Discover inspiring success stories from those whose lives have been transformed by our efforts. Learn how your support has made a tangible difference in communities around the world.
          </p>
        </div>

      </div>
    </div>
  );
}