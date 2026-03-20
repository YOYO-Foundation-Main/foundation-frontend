import BlogCard from "@/components/ui/BlogCard";
import { blogs } from "@/constants/blogs";
import Link from "next/link";

export default function BlogSection() {
  return (
    <section className="bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-semibold text-black">
            Latest News and Blog
          </h2>

          <Link
            href="/blog"
            className="border border-black text-black px-5 py-2 rounded-md text-sm hover:bg-black hover:text-white transition"
          >
            MORE NEWS
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} {...blog} />
          ))}
        </div>
      </div>
    </section>
  );
}