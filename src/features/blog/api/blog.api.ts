import { Blog, BlogResponse } from "../types/blog.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Get all blogs
export const getBlogs = async (): Promise<BlogResponse> => {
  const res = await fetch(`${BASE_URL}/api/blog`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
};

// ✅ Get single blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await fetch(`${BASE_URL}/api/blog/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch blog: ${res.status}`);
  const data = await res.json();
  // handle both direct object or { data: {...} } wrapper
  return data?.data || data;
};