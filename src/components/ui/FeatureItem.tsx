type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureItem({ icon, title, description }: Props) {
  return (
    <div className="flex items-start gap-4">
      
      {/* Icon */}
      <div className="text-[#D2252B] text-3xl mt-1">
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold text-black">
          {title}
        </h3>

        <p className="text-sm md:text-base text-gray-600 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}