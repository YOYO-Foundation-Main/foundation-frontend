import { BlogResponse } from "../types/blog.types";

export const getBlogs = async (): Promise<BlogResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/blog`,
    {
      next: { revalidate: 60 }, // ✅ caching (SSR optimized)
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
};