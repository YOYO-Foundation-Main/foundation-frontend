interface Props {
  title: string;
  breadcrumb: string;
  description?: string;
}

export default function PageHero({
  title,
  breadcrumb,
  description,
}: Props) {
  return (
    <div className="text-center py-16 border-b border-gray-200 mt-24">
      
      <p className="text-sm text-gray-500 mb-2">
        {breadcrumb}
      </p>

      <h1 className="text-4xl font-bold text-black mb-4">
        {title}
      </h1>

      {description && (
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          {description}
        </p>
      )}

    </div>
  );
}