interface Props {
  title: string;
  description: string;
}

export default function ValueCard({ title, description }: Props) {
  return (
    <div>
      <h3 className="font-semibold text-lg text-black mb-2">
        {title}
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
}