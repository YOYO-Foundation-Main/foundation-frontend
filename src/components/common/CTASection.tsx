interface Props {
  subtitle: string;
  title: string;
  buttonText?: string;
}

export default function CTASection({
  subtitle,
  title,
  buttonText = "Join Now",
}: Props) {
  return (
    <section className="bg-black text-white py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT TEXT */}
        <div className="max-w-xl">
          <p className="text-sm text-[#D2252B] mb-2">
            {subtitle}
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
            {title}
          </h2>
        </div>

        {/* BUTTON */}
        <button className="bg-[#D2252B] px-6 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition">
          {buttonText} →
        </button>

      </div>
    </section>
  );
}