import FeatureItem from "@/components/ui/FeatureItem";
import { FaBookOpen, FaTint, FaHeartbeat, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: <FaBookOpen />,
    title: "Education",
    description: "Fermentum nisl accumsan nisi sapien in vitae",
  },
  {
    icon: <FaTint />,
    title: "Clean Water",
    description: "Ultricies lacus turpis proin tempor faucibus",
  },
  {
    icon: <FaHeartbeat />,
    title: "Health Care",
    description: "Adipiscing in vitae necposue eget fringilla a morbi",
  },
  {
    icon: <FaUsers />,
    title: "Local communities",
    description: "Nunc tristique quis leo duis gravida volutpat vitae",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#F8F9FA] py-12">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {features.map((item, index) => (
          <FeatureItem
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}