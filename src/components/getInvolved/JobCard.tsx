interface Props {
  category: string;
  title: string;
  description: string;
  tags: string[];
}

export default function JobCard({
  category,
  title,
  description,
  tags,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition">
      
      {/* CATEGORY */}
      <p className="text-sm text-[#D2252B] mb-2">
        • {category}
      </p>

      {/* TITLE */}
      <h3 className="text-xl font-semibold mb-3">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        {description}
      </p>

      {/* TAGS */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <button className="text-sm font-medium border-b border-black inline-flex items-center gap-1 hover:text-[#D2252B]">
        Join Now →
      </button>
    </div>
  );
}