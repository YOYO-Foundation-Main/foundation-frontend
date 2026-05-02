import Link from "next/link";

export default function ContactHero() {
  return (
    <section className="bg-[#F8F9FA] py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-700 font-medium">Contact Us</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-6xl font-bold text-[#121212] mb-6">
          Every Act of Kindness Counts
        </h1>

        {/* Description */}
        <p className="text-[#6B6B6B] text-sm md:text-base max-w-2xl mx-auto">
          Libero dictum ut purus ut vel sit egestas. Ut ac mattis senectus ac
          suspendisse vitae vel nulla eleifend. Est eros facilisi aenean nisl a.
        </p>

      </div>
    </section>
  );
}