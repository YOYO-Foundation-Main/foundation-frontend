import DivisionCard from "./DivisionCard";

export default function DivisionSection() {
  const divisions = [
    {
      title: "Communication",
      description: "Assist with content and communication strategies.",
      jobs: "12 Jobs Available",
    },
    {
      title: "Technology",
      description: "Support the maintenance of digital platforms.",
      jobs: "4 Jobs Available",
      // active: true,
    },
    {
      title: "Program",
      description: "Help manage and coordinate community programs.",
      jobs: "28 Jobs Available",
    },
    {
      title: "Finance",
      description: "Assist with budgeting and fund allocation.",
      jobs: "2 Jobs Available",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 text-black text-center">
      
      <p className="text-sm text-red-500 mb-2">
        Our Division
      </p>

      <h2 className="text-3xl md:text-4xl text-black font-bold mb-10">
        Explore Volunteer Opportunities <br />
        Across Our Divisions
      </h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-6">
        {divisions.map((item) => (
          <DivisionCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}