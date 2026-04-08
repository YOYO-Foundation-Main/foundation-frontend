"use client";
import { useState, useEffect } from "react";
import { FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiMoreHorizontal } from "react-icons/fi";
import { adminGetBlogs, adminDeleteBlog } from "@/features/admin/api/admin.api";
import { Blog } from "@/features/blog/types/blog.types";
import CreateBlogModal from "@/components/admin/CreateBlogModal";
import EditBlogModal from "@/components/admin/EditBlogModal";
import DeleteConfirmModal from "../DeleteConfirmModal";

function isValidUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Blog | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await adminGetBlogs();
      // API returns { total, page, limit, data: [] } OR direct array
      const list: Blog[] = data?.data || (Array.isArray(data) ? data : []);
      setBlogs(list);
      if (list.length > 0 && !selected) setSelected(list[0]);
    } catch (err) {
      console.error("❌ Blogs fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleDelete = async () => {
    if (!selected) return;
    await adminDeleteBlog(selected.id);
    setBlogs((prev) => prev.filter((b) => b.id !== selected.id));
    setSelected(null);
    setShowDelete(false);
    showToast("✅ Blog deleted", "success");
  };

  const filtered = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase()) ||
    b.author?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <CreateBlogModal isOpen={showCreate} onClose={() => setShowCreate(false)} onSuccess={fetchBlogs} />
      <EditBlogModal isOpen={showEdit} blog={selected} onClose={() => setShowEdit(false)} onSuccess={fetchBlogs} />
      <DeleteConfirmModal
        isOpen={showDelete}
        title={selected?.title || ""}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />

      {/* Global toast */}
      {toast.msg && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>{toast.msg}</div>
      )}

      <div className="flex gap-5 min-h-full">

        {/* ── LEFT: List ── */}
        <div className="flex-1 min-w-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Blogs</h1>
              <p className="text-xs text-gray-400 mt-0.5">Dashboard / Blogs</p>
            </div>
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-200">
              <FiPlus size={16} /> Create Blog
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs by title, category or author..."
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 placeholder:text-gray-400" />
          </div>

          {/* Blog list */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading && <div className="p-8 text-center text-sm text-gray-400">Loading blogs...</div>}
            {!loading && filtered.length === 0 && <div className="p-8 text-center text-sm text-gray-400">No blogs found</div>}

            {!loading && filtered.map((blog) => {
              const isSelected = selected?.id === blog.id;
              const validImage = isValidUrl(blog.image);

              return (
                <div key={blog.id} onClick={() => setSelected(blog)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition border-b border-gray-50 last:border-0 ${
                    isSelected ? "bg-blue-50/60" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center">
                    {validImage
                      ? <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      : <span className="text-[10px] text-gray-400">No Image</span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    {blog.category && (
                      <span className="text-[10px] bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full border border-blue-100 mb-1 inline-block">
                        {blog.category}
                      </span>
                    )}
                    <p className="text-sm font-semibold text-gray-800 truncate">{blog.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-400">
                      {blog.author && <span>By {blog.author}</span>}
                      <span>{new Date(blog.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>
                  </div>

                  {/* Content preview */}
                  <p className="hidden lg:block text-xs text-gray-400 max-w-[200px] line-clamp-2 shrink-0">
                    {blog.content}
                  </p>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => { setSelected(blog); setShowEdit(true); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition" title="Edit">
                      <FiEdit2 size={12} />
                    </button>
                    <button onClick={() => { setSelected(blog); setShowDelete(true); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition" title="Delete">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Count */}
          {!loading && (
            <p className="text-xs text-gray-400 mt-3">{filtered.length} blog{filtered.length !== 1 ? "s" : ""} total</p>
          )}
        </div>

        {/* ── RIGHT: Detail Panel ── */}
        {selected && (
          <div className="w-[340px] shrink-0 bg-white rounded-xl border border-gray-200 overflow-y-auto max-h-[calc(100vh-140px)] sticky top-0">

            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              {selected.category && (
                <span className="text-[10px] bg-blue-50 text-blue-500 px-2.5 py-1 rounded-full border border-blue-100 font-medium">
                  {selected.category}
                </span>
              )}
              <button onClick={() => setSelected(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition ml-auto">
                <FiX size={15} />
              </button>
            </div>

            <div className="p-4 space-y-4">

              {/* Image */}
              <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                {isValidUrl(selected.image)
                  ? <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                  : <span className="text-sm text-gray-400">No Image</span>
                }
              </div>

              {/* Title */}
              <h2 className="text-base font-bold text-gray-800 leading-snug">{selected.title}</h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {selected.author && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                      {selected.author.charAt(0).toUpperCase()}
                    </div>
                    {selected.author}
                  </div>
                )}
                <span>{new Date(selected.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>

              {/* Content preview */}
              <div>
                <p className="text-xs font-semibold text-gray-600 mb-1">Content</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-8">{selected.content}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowEdit(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                  <FiEdit2 size={13} /> Edit Blog
                </button>
                <button onClick={() => setShowDelete(true)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 text-xs font-semibold py-2.5 rounded-xl transition border border-red-200 flex items-center justify-center gap-2">
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}