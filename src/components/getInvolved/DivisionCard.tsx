interface Props {
  title: string;
  description: string;
  jobs: string;
  active?: boolean;
}

export default function DivisionCard({
  title,
  description,
  jobs,
  active,
}: Props) {
  return (
    <div
      className={`
        p-6 rounded-xl text-center transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-xl hover:z-10
        ${active 
          ? "bg-white shadow-md border border-gray-100"  // Active card - normal size, just different styling
          : "bg-gray-50 hover:bg-white"
        }
      `}
      style={{
        transform: "scale(1)", // Force normal scale
      }}
    >
      <p className="text-xs mb-3 text-gray-500">{jobs}</p>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      <button className="text-sm font-medium text-black hover:underline transition-colors duration-200 hover:text-[#D2252B]">
        See All Job →
      </button>
    </div>
  );
}