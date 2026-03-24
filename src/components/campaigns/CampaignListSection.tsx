import Image from "next/image";

interface Campaign {
  id: number;
  category: string;
  title: string;
  image: string;
  description: string;
  progress: number;
}

export default function CampaignListSection() {
  const campaigns: Campaign[] = [
    {
      id: 1,
      category: "Education",
      title: "Books For Hope",
      image: "/assets/c1.jpg",
      description:
        "Providing education access for underprivileged children.",
      progress: 56,
    },
    {
      id: 2,
      category: "Healthcare",
      title: "Healthy Tomorrow",
      image: "/assets/c2.jpg",
      description:
        "Providing essential healthcare services to underserved communities.",
      progress: 56,
    },
    {
      id: 3,
      category: "Clean Water Access",
      title: "Water For Life",
      image: "/assets/c3.jpg",
      description:
        "Ensuring clean water for remote communities.",
      progress: 56,
    },
    {
      id: 4,
      category: "Education",
      title: "Books For Hope",
      image: "/assets/c1.jpg",
      description:
        "Providing education access for underprivileged children.",
      progress: 56,
    },
    {
      id: 5,
      category: "Healthcare",
      title: "Healthy Tomorrow",
      image: "/assets/c2.jpg",
      description:
        "Providing essential healthcare services to underserved communities.",
      progress: 56,
    },
    {
      id: 6,
      category: "Environmental",
      title: "Green Earth",
      image: "/assets/c2.jpg",
      description:
        "Promoting sustainability and protecting nature.",
      progress: 56,
    },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-[#D2252B] text-sm mb-2">
            Our Campaigns
          </p>

          <h2 className="text-3xl md:text-4xl font-semibold text-black">
            Join Our Campaigns And <br />
            Be A Part Of Positive Change
          </h2>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {campaigns.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition"
            >
              {/* CATEGORY */}
              <p className="text-sm text-[#D2252B] mb-2">
                • {item.category}
              </p>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-black mb-4">
                {item.title}
              </h3>

              {/* IMAGE */}
              <div className="relative">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-lg"
                />

                {/* PROGRESS OVERLAY */}
                <div className="absolute bottom-3 left-3 right-3 bg-white rounded-md px-3 py-2 shadow">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Goal</span>
                    <span>{item.progress}%</span>
                  </div>

                  <div className="w-full h-1 bg-gray-200 rounded">
                    <div
                      className="h-1 bg-[#D2252B] rounded"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* DESC */}
              <p className="text-sm text-gray-500 mt-4">
                {item.description}
              </p>

              {/* BUTTON */}
              <button className="mt-4 text-[#D2252B] text-sm font-medium hover:underline">
                Donate Now ↗
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}