import { Rocket, Briefcase, Globe, Gift } from "lucide-react";

const stats = [
  {
    icon: Rocket,
    value: "1.2k+",
    label: "Projects Completed",
  },
  {
    icon: Briefcase,
    value: "100",
    label: "Monthly Donate",
  },
  {
    icon: Globe,
    value: "480",
    label: "Partners Worldwide",
  },
  {
    icon: Gift,
    value: "1.4m",
    label: "Donations Received",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#f5f5f5] py-14">
      <div className="max-w-7xl mx-auto px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map((item, i) => {
            const Icon = item.icon;

            return (
              <div key={i} className="flex flex-col items-center">
                
                {/* Icon */}
                <Icon className="text-[#D2252B] mb-4" size={32} />

                {/* Value (BIG) */}
                <h3 className="text-3xl md:text-4xl font-bold text-black">
                  {item.value}
                </h3>

                {/* Label */}
                <p className="text-sm md:text-base text-gray-600 mt-2">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}