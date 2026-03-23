export default function ImpactSection() {
  const stats = [
    { value: "500k", label: "Lives Impacted" },
    { value: "200+", label: "Clean Water Projects" },
    { value: "250k", label: "Meals Served" },
    { value: "50+", label: "Disaster Relief" },
    { value: "20k", label: "Education Provided" },
    { value: "30k", label: "Healthcare Services" },
    { value: "100+", label: "Communities Supported" },
    { value: "300+", label: "Communities Empowered" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* TOP TEXT */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">

          <div>
            <p className="text-[#D2252B] text-sm mb-2">Impact</p>

            <h2 className="text-3xl md:text-4xl font-semibold text-black leading-snug">
              Real Change <br /> Through Collective Action
            </h2>
          </div>

          <div className="text-gray-500 text-sm space-y-4">
            <p>
              We have created a meaningful impact across diverse communities,
              transforming lives through sustainable programs in education,
              healthcare, clean water, and more.
            </p>

            <p>
              With the unwavering support of donors and volunteers, we continue
              to expand our reach, uplifting more lives and empowering
              communities in need through impactful, long-lasting initiatives.
            </p>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t pt-10">
          {stats.map((item, index) => (
            <div key={index}>
              <h3 className="text-3xl font-bold text-black">
                {item.value}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}