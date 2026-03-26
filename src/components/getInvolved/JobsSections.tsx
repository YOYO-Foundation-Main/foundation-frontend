import JobCard from "./JobCard";

export default function JobsSection() {
  const jobs = [
    {
      category: "Communication",
      title: "Content Creator",
      description:
        "Create engaging content for campaigns, social media, and internal communication strategies.",
      tags: ["Creative", "Strategy", "Marketing"],
    },
    {
      category: "Technology",
      title: "Web Developer",
      description:
        "Develop and maintain the organization's website and digital platforms.",
      tags: ["Products", "Dashboard", "WordPress"],
    },
    {
      category: "Finance",
      title: "Financial Analyst",
      description:
        "Assist in financial planning, budgeting, and analysis to ensure efficiency.",
      tags: ["Analysis", "Planning", "Budgeting"],
    },
  ];

  return (
    <section className="py-20 bg-[#F5F5F5] px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row text-black md:items-center md:justify-between mb-12 gap-6">
          
          <div>
            <p className="text-sm text-[#D2252B] mb-2">
              Job Available
            </p>

            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Explore Exciting Career <br />
              Opportunities In Our Organization
            </h2>
          </div>

          <button className="bg-[#D2252B] text-white px-5 py-2 rounded-full text-sm self-start md:self-auto">
            See All Job →
          </button>

        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 text-black gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} {...job} />
          ))}
        </div>

      </div>
    </section>
  );
}