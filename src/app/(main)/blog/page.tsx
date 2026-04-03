import BlogCard from "@/components/ui/BlogCard";
import { getBlogs } from "@/features/blog/api/blog.api";
import { Blog } from "@/features/blog/types/blog.types";

export default async function BlogPage() {
  let blogs: Blog[] = [];

  try {
    const res = await getBlogs();
    blogs = res.data;
  } catch (error) {
    return (
      <div className="bg-[#F5F5F5] pt-[72px] min-h-screen">
        <div className="py-16 text-center">
          <p className="text-gray-500">Failed to load blogs</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F5] pt-[72px] min-h-screen">

      {/* Hero */}
      <div className="text-center py-16 border-b border-gray-200 bg-white">
        <p className="text-sm text-gray-500 mb-3">Home &gt; Blog</p>
        <h1 className="text-4xl font-bold text-black mb-4">Latest News & Blog</h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          Stay updated with the latest news, stories, and insights from YOYO Foundation.
        </p>
      </div>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-8">

          {blogs.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No blogs available</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  date={new Date(blog.createdAt).toDateString()}
                  image={blog.image}
                  description={blog.content}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}