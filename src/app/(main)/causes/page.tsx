import FeaturesSection from "@/components/common/FeaturesSection";
import CausesListSection from "../../../components/common/CausesListSection";

export default function CausesPage() {
  return (
    <main className="bg-[#f5f5f5] min-h-screen pt-24">
      
      {/* HERO HEADER */}
      <section className="text-center py-16 px-6">
        <p className="text-sm text-gray-500 mb-2">
          Home &gt; Causes
        </p>

        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Donate Today: Save a Life
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
          Libero dictum ut purus vel sit egestas. Ut ac mattis senectus ac
          suspendisse vitae vel nulla eleifend.
        </p>
      </section>

      {/* FEATURES (reuse) */}
      <FeaturesSection />

      {/* CAUSES LIST */}
      <CausesListSection />

    </main>
  );
}