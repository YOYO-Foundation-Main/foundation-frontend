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

import { getCampaigns } from "@/features/campaigns/api/campaign.api";
import { Campaign } from "@/features/campaigns/types/campaign.types";

// Icon mapping (based on cause name)
const iconMap: Record<string, any> = {
  Education: <FaGraduationCap />,
  Healthcare: <FaHeartbeat />,
  Environmental: <FaLeaf />,
  Hunger: <FaAppleAlt />,
  "Disaster Response": <FaBolt />,
  "Clean Water": <FaTint />,
  "Youth Empowerment": <FaUsers />,
  "Women’s Rights": <FaFemale />,
};

export default async function CampaignCategories() {
  let campaigns: Campaign[] = [];

  try {
    const data = await getCampaigns();
    campaigns = data.campaigns;
  } catch (err) {
    console.error("❌ CampaignCategories error:", err);
  }

  // ✅ Extract unique causes
  const categoriesMap = new Map();

  campaigns.forEach((item) => {
    const causeName = item.cause?.name || "General";

    if (!categoriesMap.has(causeName)) {
      categoriesMap.set(causeName, {
        title: causeName,
        desc: item.cause?.description || "No description available",
        icon: iconMap[causeName] || <FaUsers />,
      });
    }
  });

  const categories = Array.from(categoriesMap.values());

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