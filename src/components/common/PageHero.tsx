import Link from "next/link";

interface PageHeroProps {
  title: string;
  breadcrumb: string;
  description: string;
}

export default function PageHero({
  title,
  breadcrumb,
  description,
}: PageHeroProps) {
  return (
    <section className="bg-[#F5F5F5] pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto text-center">

        {/* BREADCRUMB */}
        <p className="text-sm text-gray-500 mb-4">
          {breadcrumb}
        </p>

        {/* TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4 leading-tight">
          {title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

      </div>
    </section>
  );
}