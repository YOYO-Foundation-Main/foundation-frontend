export default function VolunteerStats() {
  const stats = [
    { value: "7,350", label: "Donations Made" },
    { value: "3,910", label: "Causes" },
    { value: "2,090", label: "Programs" },
    { value: "4,153", label: "Children Helped" },
    { value: "2,752", label: "Medical Packages" },
  ];

  return (
    <div className="bg-[#F3B4B4] py-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 text-center gap-10">

        {stats.map((item) => (
          <div key={item.label} className="space-y-2">

            {/* VALUE */}
            <h3 className="text-3xl md:text-5xl font-extrabold text-black">
              {item.value}
            </h3>
?
            {/* LABEL */}
            <p className="text-sm md:text-base text-gray-800 font-medium tracking-wide">
              {item.label}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}