import Image from "next/image";
import ValueCard from "./ValueCard";

export default function CoreValuesSection() {
  const values = [
    {
      title: "Integrity",
      description:
        "We uphold transparency, accountability, and honesty in all our actions.",
    },
    {
      title: "Empowerment",
      description:
        "We strive to uplift communities by fostering growth and building capacity.",
    },
    {
      title: "Collaboration",
      description:
        "We work together with stakeholders to amplify impact and achieve shared goals.",
    },
    {
      title: "Sustainability",
      description:
        "We focus on long-term solutions that ensure lasting, positive change.",
    },
  ];

  return (
    <section className="bg-[#F7F2ED] py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TOP TEXT */}
        <div className="grid md:grid-cols-2 gap-10 items-start mb-10">

          <div>
            <p className="text-sm text-[#D2252B] mb-2">
              Our Value
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Core Values Driving <br />
              Positive Change
            </h2>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed">
            We prioritize integrity, empowerment, collaboration, and sustainability to create lasting impact and support the growth of thriving communities.
          </p>

        </div>

        {/* IMAGES */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          
          <Image
            src="/assets/core1.jpg"
            alt="value"
            width={500}
            height={300}
            className="rounded-xl object-cover w-full h-[250px]"
          />

          <Image
            src="/assets/core2.jpg"
            alt="value"
            width={500}
            height={300}
            className="rounded-xl object-cover w-full h-[250px]"
          />

        </div>

        {/* VALUES LIST */}
        <div className="grid md:grid-cols-4 gap-8">
          {values.map((item) => (
            <ValueCard key={item.title} {...item} />
          ))}
        </div>

      </div>
    </section>
  );
}