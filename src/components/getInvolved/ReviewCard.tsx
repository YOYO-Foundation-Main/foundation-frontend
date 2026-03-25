interface Props {
  name: string;
  role: string;
  review: string;
}

export default function ReviewCard({ name, role, review }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm min-w-[300px] max-w-[320px]">
      
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        {review}
      </p>

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300" />

        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
}