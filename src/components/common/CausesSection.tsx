import CauseCard from "@/components/ui/CauseCard";
import Link from "next/link";
import { getCauses } from "@/features/causes/api/causes.api";

export default async function CausesSection() {
  let causes: any[] = [];
  try {
    const data = await getCauses();
    causes = data.slice(0, 3);
  } catch (err) {
    console.error("❌ CausesSection error:", err);
  }

  return (
    <section className="bg-[#f5f5f5] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-2">Make a Difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-black">Latest Causes</h2>
          </div>
          <Link href="/causes"
            className="shrink-0 border-2 border-black text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-black hover:text-white transition-all">
            More Causes
          </Link>
        </div>

        {causes.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No causes available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {causes.map((cause) => (
              <CauseCard key={cause.id} id={String(cause.id)}
                name={cause.name} image={cause.image} description={cause.description} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}