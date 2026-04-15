interface Props {
  name: string;
  role: string;
  review: string;
}

export default function ReviewCard({ name, role, review }: Props) {
  // Get initials for avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="
      bg-white rounded-2xl p-6 shadow-md 
      min-w-[300px] max-w-[320px] h-full
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-xl hover:z-10
      flex flex-col
      border border-gray-100
      group
    ">
      {/* Quote icon */}
      <div className="text-[#D2252B] text-3xl font-serif mb-2 opacity-50 group-hover:opacity-100 transition">
        "
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1 line-clamp-4">
        {review}
      </p>

      {/* Divider */}
      <div className="w-12 h-0.5 bg-[#D2252B]/30 rounded-full mb-4 group-hover:w-16 transition-all duration-300" />

      {/* Author section */}
      <div className="flex items-center gap-3">
        {/* Avatar with initials */}
        <div className="
          w-10 h-10 rounded-full bg-gradient-to-br from-[#D2252B] to-[#b91c22] 
          flex items-center justify-center text-white font-bold text-sm
          shadow-md group-hover:scale-110 transition-transform duration-300
        ">
          {initials}
        </div>

        <div>
          <p className="font-semibold text-sm text-gray-800 group-hover:text-[#D2252B] transition-colors">
            {name}
          </p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}