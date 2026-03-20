import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="bg-[#F8F9FA] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">About Us</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#121212] leading-tight mb-6">
          United for Good, Strong for Charity
        </h1>

        {/* Description */}
        <p className="text-[#6B6B6B] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac
          suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a.
          Vitae et fusce purus consectetur.
        </p>

      </div>
    </section>
  );
}