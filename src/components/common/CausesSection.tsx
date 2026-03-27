import CauseCard from "@/components/ui/CauseCard";
import Link from "next/link";
import { getCauses } from "@/features/causes/api/causes.api";

export default async function CausesSection() {
  let causes: any[] = [];

  try {
    const data = await getCauses();
    causes = data.slice(0, 3); // show only 3 on homepage
  } catch (err) {
    console.error("❌ CausesSection error:", err);
  }

  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-semibold text-black">Latest Causes</h2>
          <Link
            href="/causes"
            className="border border-black text-black px-5 py-2 rounded-md text-sm hover:bg-black hover:text-white transition"
          >
            MORE CAUSES
          </Link>
        </div>

        {causes.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No causes available</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {causes.map((cause) => (
              <CauseCard
                key={cause.id}
                id={String(cause.id)}
                name={cause.name}
                image={cause.image}
                description={cause.description}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}