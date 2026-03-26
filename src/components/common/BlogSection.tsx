import BlogCard from "@/components/ui/BlogCard";
import Link from "next/link";
import { getBlogs } from "@/features/blog/api/blog.api";
import { Blog } from "@/features/blog/types/blog.types";

export default async function BlogSection() {
  let blogs: Blog[] = [];

  try {
    const res = await getBlogs();
    blogs = res.data;
  } catch (error) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">Failed to load blogs</p>
      </section>
    );
  }

  if (!blogs.length) {
    return (
      <section className="py-16 text-center">
        <p className="text-gray-500">No blogs available</p>
      </section>
    );
  }

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
            className="border text-black border-black px-5 py-2 rounded-md text-sm hover:bg-black hover:text-white transition"
          >
            MORE NEWS
          </Link>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              title={blog.title}
              date={new Date(blog.createdAt).toDateString()}
              image={blog.image}
              description={blog.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
}