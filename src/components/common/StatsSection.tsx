import { Rocket, Briefcase, Globe, Gift } from "lucide-react";

const stats = [
  { icon: Rocket,    value: "1.2k+", label: "Projects Completed" },
  { icon: Briefcase, value: "100",   label: "Monthly Donations" },
  { icon: Globe,     value: "480",   label: "Partners Worldwide" },
  { icon: Gift,      value: "1.4M",  label: "Donations Received" },
];

export default function StatsSection() {
  return (
    <section className="bg-[#D2252B] py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 text-center">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
                <Icon className="text-white" size={22} />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white">{value}</h3>
              <p className="text-sm text-red-100 mt-1.5 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}