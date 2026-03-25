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
      className={`p-6 rounded-xl text-center transition shadow-sm ${
        active
          ? "bg-white shadow-xl scale-105"
          : "bg-gray-50"
      }`}
    >
      <p className="text-xs mb-3 text-gray-500">{jobs}</p>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      <button className="text-sm font-medium text-black hover:underline">
        See All Job →
      </button>
    </div>
  );
}