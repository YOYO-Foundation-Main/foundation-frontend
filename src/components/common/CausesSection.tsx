import CauseCard from "@/components/ui/CauseCard";
import { causes } from "@/constants/causes";
import Link from "next/link";

export default function CausesSection() {
  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold text-black">
            Latest Causes
          </h2>

          <Link
            href="/causes"
            className="border border-black text-black px-5 py-2 rounded-md text-sm 
                       hover:bg-black hover:text-white transition"
          >
            MORE CAUSES
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {causes.map((cause) => (
            <CauseCard
              key={cause.id} // ✅ IMPORTANT
              id={String(cause.id)} // ✅ for routing
              title={cause.title}
              image={cause.image}
              description={cause.description}
              goal={cause.goal}
              raised={cause.raised}
              donations={cause.donations}
            />
          ))}
        </div>
      </div>
    </section>
  );
}