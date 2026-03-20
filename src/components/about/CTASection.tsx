import { FaHeart, FaHandHoldingHeart, FaUserFriends } from "react-icons/fa";

const cards = [
  {
    title: "Help",
    description:
      "Mattis et aliquam fermentum sed sagittis eu elit mauris. Nisl eros vel neque vitae lorem molestie.",
    icon: <FaHeart />,
    highlighted: false,
  },
  {
    title: "Donation",
    description:
      "Mattis et aliquam fermentum sed sagittis eu elit mauris. Nisl eros vel neque vitae lorem molestie.",
    icon: <FaHandHoldingHeart />,
    highlighted: true,
  },
  {
    title: "Volunteer",
    description:
      "Mattis et aliquam fermentum sed sagittis eu elit mauris. Nisl eros vel neque vitae lorem molestie.",
    icon: <FaUserFriends />,
    highlighted: false,
  },
];

export default function CTASection() {
  return (
    <section className="bg-[#F8F9FA] py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-3xl p-10 text-center transition duration-300
              ${
                card.highlighted
                  ? "bg-[#D2252B] text-white shadow-xl scale-105"
                  : "bg-white text-[#121212] shadow-md hover:shadow-lg"
              }`}
            >
              
              {/* ICON */}
              <div
                className={`text-3xl mb-6 flex justify-center
                ${
                  card.highlighted
                    ? "text-white"
                    : "text-[#D2252B]"
                }`}
              >
                {card.icon}
              </div>

              {/* TITLE */}
              <h3
                className={`text-xl font-semibold mb-4 ${
                  card.highlighted ? "text-white" : "text-[#D2252B]"
                }`}
              >
                {card.title}
              </h3>

              {/* DESCRIPTION */}
              <p
                className={`text-sm leading-relaxed mb-8 ${
                  card.highlighted
                    ? "text-white/90"
                    : "text-[#6B6B6B]"
                }`}
              >
                {card.description}
              </p>

              {/* BUTTON */}
              <button
                className={`px-6 py-2 rounded-full text-sm border transition
                ${
                  card.highlighted
                    ? "border-white text-white hover:bg-white hover:text-[#D2252B]"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                Learn More
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}