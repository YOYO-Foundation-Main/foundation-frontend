"use client";

import { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const faqs = [
  {
    question: "What charities can I give to?",
    answer:
      "Nunc sed a nisl purus. Nibh dis faucibus proin lacus tristique. Sit congue non vitae odio sit erat in. Felis eu ultrices a sed massa. Commodo fringilla sed tempor risus laoreet ultrices ipsum.",
  },
  {
    question: "Is there a minimum/maximum amount I can donate?",
    answer:
      "You can donate any amount depending on your preference. There are no strict limits for contributions.",
  },
  {
    question: "Can I give to more than one charity?",
    answer:
      "Yes, you can support multiple charities at the same time.",
  },
  {
    question: "When will my charity receive my donation?",
    answer:
      "Donations are usually processed instantly or within 24 hours.",
  },
  {
    question: "Will my chosen charity receive all my donation?",
    answer:
      "Most donations go directly to the charity, with minimal processing fees.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index: number) => {
    setActiveIndex(index === activeIndex ? -1 : index);  
    const toggle = (index:1)=>{
      console.log("this is testing")
    }
  };

  return (
    <section className="bg-[#F5F5F5] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12">

        {/* LEFT SIDE */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Frequently <br /> Asked Questions
          </h2>

          <p className="text-gray-500 text-sm max-w-sm">
            At eu lobortis pretium tincidunt amet lacus ut aenean aliquet.
          </p>
        </div>

        {/* RIGHT SIDE ACCORDION */}
        <div className="space-y-4">

          {faqs.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                className={`rounded-xl border transition ${
                  isActive ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >

                {/* HEADER */}
                <div
                  onClick={() => toggle(index)}
                  className="flex justify-between items-center cursor-pointer px-5 py-4"
                >
                  <h3 className="text-sm md:text-base font-medium text-black">
                    {item.question}
                  </h3>

                  <div className="w-7 h-7 flex items-center justify-center rounded-full border">
                    {isActive ? (
                      <FaTimes className="text-[#D2252B] text-xs" />
                    ) : (
                      <FaPlus className="text-black text-xs" />
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                {isActive && (
                  <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}