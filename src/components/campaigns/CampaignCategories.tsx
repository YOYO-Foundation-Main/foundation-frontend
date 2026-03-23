import {
  FaGraduationCap,
  FaHeartbeat,
  FaLeaf,
  FaAppleAlt,
  FaBolt,
  FaTint,
  FaUsers,
  FaFemale,
} from "react-icons/fa";

export default function CampaignCategories() {
  const categories = [
    {
      icon: <FaGraduationCap />,
      title: "Education",
      desc: "Empowering future leaders through access to quality education.",
    },
    {
      icon: <FaHeartbeat />,
      title: "Healthcare",
      desc: "Providing essential healthcare services to underserved communities.",
    },
    {
      icon: <FaLeaf />,
      title: "Environmental",
      desc: "Promoting sustainability and protecting natural resources.",
    },
    {
      icon: <FaAppleAlt />,
      title: "Hunger",
      desc: "Fighting hunger by providing nutritious food to those in need.",
    },
    {
      icon: <FaBolt />,
      title: "Disaster Response",
      desc: "Providing urgent aid to rebuild lives after disasters.",
    },
    {
      icon: <FaTint />,
      title: "Clean Water",
      desc: "Ensuring access to safe, clean water for all communities.",
    },
    {
      icon: <FaUsers />,
      title: "Youth Empowerment",
      desc: "Supporting young leaders to shape a brighter future.",
    },
    {
      icon: <FaFemale />,
      title: "Women’s Rights",
      desc: "Advocating for equality and empowering women worldwide.",
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6">

        {categories.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-6 text-center 
                       hover:shadow-md transition group"
          >
            {/* ICON */}
            <div className="text-3xl text-blue-400 mb-4 flex justify-center group-hover:text-[#D2252B] transition">
              {item.icon}
            </div>

            {/* TITLE */}
            <h3 className="font-semibold text-black mb-2">
              {item.title}
            </h3>

            {/* DESC */}
            <p className="text-sm text-gray-500 mb-4">
              {item.desc}
            </p>

            {/* LINK */}
            <button className="text-sm text-gray-600 hover:text-black flex items-center justify-center gap-1">
              See All Campaigns →
            </button>
          </div>
        ))}

      </div>
    </section>
  );
}