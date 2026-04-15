import Image from "next/image";

const steps = [
  { n: 1, text: "Choose your cause" },
  { n: 2, text: "Register on our website" },
  { n: 3, text: "Donate the amount you like" },
  { n: 4, text: "Stay tuned about cause" },
];

export default function TransformSection() {
  return (
    <section className="bg-[#f5f5f5] py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Image */}
        <div className="w-full order-2 lg:order-1">
          <Image src="/assets/tr.jpg" alt="transform" width={600} height={450}
            className="rounded-2xl object-cover w-full h-auto shadow-sm" />
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <p className="text-[#D2252B] text-xs font-bold tracking-[0.2em] uppercase mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold text-black leading-tight">
            Transforming Good Intentions <br className="hidden lg:block" /> into Good Actions
          </h2>
          <p className="text-gray-500 text-base mt-5 leading-relaxed max-w-lg">
            From choosing your cause to making a difference — we make it simple
            to create real impact in people's lives.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {steps.map(({ n, text }) => (
              <div key={n} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <span className="bg-[#D2252B] text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold shrink-0">
                  {n}
                </span>
                <p className="text-gray-800 text-sm font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}