import { getBlogById, getBlogs } from "@/features/blog/api/blog.api";
import { Blog } from "@/features/blog/types/blog.types";
import BlogCard from "@/components/ui/BlogCard";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
 
export const dynamic = "force-dynamic";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let blog: Blog | null = null;
  let related: Blog[] = [];

  try {
    blog = await getBlogById(id);
  } catch (err) {
    return (
      <div className="bg-[#F5F5F5] pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load blog post.</p>
      </div>
    ); 
  }

  if (!blog) {
    return (
      <div className="bg-[#F5F5F5] pt-[72px] min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Blog post not found.</p>
      </div>
    );
  }

  // Fetch related blogs
  try {
    const res = await getBlogs();
    related = res.data.filter((b) => b.id !== blog.id).slice(0, 3);
  } catch {
    // ignore errors
  }

  return (
    <div className="bg-[#F5F5F5] pt-[72px] min-h-screen">

      {/* Hero Image */}
      <div className="relative w-full h-[400px] bg-gray-200">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-8 pb-10 w-full">
            {blog.category && (
              <span className="bg-[#D2252B] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                {blog.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">

        {/* Back + Meta */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition"
          >
            <FaArrowLeft size={12} /> Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {blog.author && (
              <span>
                By <span className="font-medium text-gray-600">{blog.author}</span>
              </span>
            )}
            <span>{new Date(blog.createdAt).toDateString()}</span>
          </div>
        </div>

        {/* Article */}
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {blog.content}
          </div>
        </div>

        {/* Category */}
        {blog.category && (
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-gray-500">Category:</span>
            <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>
        )}
      </div>

      {/* Related Blogs */}
      {related.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-2xl font-semibold text-black mb-8">More Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((b) => (
                <BlogCard
                  key={b.id}
                  id={b.id}
                  title={b.title}
                  date={new Date(b.createdAt).toDateString()}
                  image={b.image}
                  description={b.content}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}