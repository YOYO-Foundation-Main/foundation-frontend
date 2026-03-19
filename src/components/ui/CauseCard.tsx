import Image from "next/image";

interface Cause {
  title: string;
  image: string;
  description: string;
  goal: number;
  raised: number;
  donations: number;
}

export default function CauseCard({
  title,
  image,
  description,
  goal,
  raised,
  donations,
}: Cause) {
  const progress = (raised / goal) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      
      {/* Image */}
      <Image
        src={image}
        alt={title}
        width={400}
        height={250}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-black">{title}</h3>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {description}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-[#D2252B] rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Goal: ₹{goal}</span>
            <span>{donations} donations</span>
          </div>
        </div>

        {/* Button */}
        <button className="mt-5 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition">
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}