"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    FileText,
    Clock,
    X,
    Loader2,
    AlertCircle,
    RefreshCw,
    Check,
    Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
    adminGetNews,
    adminCreateNews,
    adminUpdateNews,
    adminDeleteNews,
} from "@/features/admin/api/admin.api";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */

interface NewsItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    imageUrl: string;
    content: string;
    readTimeMinutes: number;
    isPublished: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface NewsFormState {
    title: string;
    category: string;
    imageUrl: string;
    image: File | null;
    content: string;
    readTimeMinutes: number;
    isPublished: boolean;
}

type FilterStatus = "ALL" | "PUBLISHED" | "DRAFT";

const EMPTY_FORM: NewsFormState = {
    title: "",
    category: "",
    imageUrl: "",
    image: null,
    content: "",
    readTimeMinutes: 3,
    isPublished: false,
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function fmtDate(d: string | null) {
    if (!d) return "Not published";
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0].toUpperCase())
        .join("");
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */

function StatusBadge({ published }: { published: boolean }) {
    if (published) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Published
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Draft
        </span>
    );
}

/* ─────────────────────────────────────────────
   CONFIRM DELETE MODAL
───────────────────────────────────────────── */

function ConfirmDeleteModal({
    open,
    title,
    onClose,
    onConfirm,
    busy,
}: {
    open: boolean;
    title: string;
    onClose: () => void;
    onConfirm: () => void;
    busy: boolean;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </div>
                    <h3 className="font-bold text-slate-900">Delete Article?</h3>
                </div>
                <p className="text-sm text-slate-500 mb-1">
                    This action cannot be undone. The following article will be permanently removed:
                </p>
                <p className="text-sm font-semibold text-slate-800 mb-5 line-clamp-2">{title}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={busy}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={busy}
                        className="flex items-center gap-2 rounded-xl bg-[#D2252B] hover:bg-red-700 px-5 py-2 text-sm font-semibold text-white transition disabled:opacity-60"
                    >
                        {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   NEWS FORM MODAL
───────────────────────────────────────────── */

function NewsFormModal({
    open,
    editItem,
    onClose,
    onSuccess,
}: {
    open: boolean;
    editItem: NewsItem | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [form, setForm] = useState<NewsFormState>(EMPTY_FORM);
    const [busy, setBusy] = useState(false);
    const [imgError, setImgError] = useState(false);

    const isEdit = editItem !== null;

    useEffect(() => {
        if (!open) return;
        if (editItem) {
            setForm({
                title: editItem.title,
                category: editItem.category,
                imageUrl: editItem.imageUrl,
                image: null,
                content: editItem.content,
                readTimeMinutes: editItem.readTimeMinutes,
                isPublished: editItem.isPublished,
            });
        } else {
            setForm({
                ...EMPTY_FORM,
                image: null,
            });
        }
        setImgError(false);
    }, [open, editItem]);

    const set = <K extends keyof NewsFormState>(key: K, val: NewsFormState[K]) =>
        setForm((f) => ({ ...f, [key]: val }));

    const validate = (): boolean => {
        if (!form.title.trim()) {
            toast.error("Title is required");
            return false;
        }

        if (!form.category.trim()) {
            toast.error("Category is required");
            return false;
        }

        // Image required only while creating
        if (!isEdit && !form.image) {
            toast.error("News image is required");
            return false;
        }

        if (!form.content.trim()) {
            toast.error("Content is required");
            return false;
        }

        if (
            !form.readTimeMinutes ||
            form.readTimeMinutes < 1 ||
            form.readTimeMinutes > 60
        ) {
            toast.error("Read time must be between 1 and 60 minutes");
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        try {
            setBusy(true);

            const formData = new FormData();

            formData.append("title", form.title.trim());
            formData.append("category", form.category.trim());
            formData.append("content", form.content.trim());

            formData.append(
                "readTimeMinutes",
                String(Number(form.readTimeMinutes))
            );

            formData.append(
                "isPublished",
                String(form.isPublished)
            );

            // Upload only when a new image is selected
            if (form.image) {
                formData.append("image", form.image);
            }

            if (isEdit && editItem) {
                await adminUpdateNews(editItem.id, formData);
                toast.success("News article updated");
            } else {
                await adminCreateNews(formData);
                toast.success("News article created");
            }

            onSuccess();
            onClose();
        } catch (e: unknown) {
            toast.error(
                e instanceof Error ? e.message : "Action failed"
            );
        } finally {
            setBusy(false);
        }
    };

    if (!open) return null;

    const showPreview = form.imageUrl.trim().length > 0 && !imgError;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
            <div className="relative h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 shrink-0">
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h2 className="font-extrabold text-slate-900">
                            {isEdit ? "Edit Article" : "Create Article"}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {isEdit ? `Editing: ${editItem?.title}` : "Fill in the details to publish a new news article"}
                        </p>
                    </div>
                    <StatusBadge published={form.isPublished} />
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Title <span className="text-[#D2252B]">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            placeholder="e.g. Bringing Hope Through Free Medical Camps"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 transition placeholder:text-slate-400"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Slug will be auto-generated from the title</p>
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Category <span className="text-[#D2252B]">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            placeholder="e.g. Healthcare Initiative, Women Empowerment…"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 transition placeholder:text-slate-400"
                        />
                    </div>

                    {/* News Image Upload + Preview */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            News Image <span className="text-[#D2252B]">*</span>
                        </label>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (!file) return;

                                // Optional client-side size validation: 5 MB
                                if (file.size > 5 * 1024 * 1024) {
                                    toast.error("Image size must be less than 5 MB");
                                    e.target.value = "";
                                    return;
                                }

                                set("image", file);
                                setImgError(false);
                            }}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 transition"
                        />

                        <p className="text-[10px] text-slate-400 mt-1">
                            JPG, PNG or WebP · Maximum 5 MB
                        </p>

                        {/* Image Preview */}
                        <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                            {form.imageUrl || form.image ? (
                                <img
                                    src={
                                        form.image
                                            ? URL.createObjectURL(form.image)
                                            : form.imageUrl
                                    }
                                    alt="News preview"
                                    className="w-full h-36 object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-24 gap-2">
                                    <ImageIcon className="h-6 w-6 text-slate-300" />

                                    <span className="text-[10px] text-slate-400">
                                        Select an image to see preview
                                    </span>
                                </div>
                            )}

                            {imgError && (
                                <p className="text-xs text-red-500 px-3 py-2">
                                    Image preview failed
                                </p>
                            )}
                        </div>

                        {isEdit && form.imageUrl && !form.image && (
                            <p className="text-[10px] text-slate-400 mt-1">
                                Existing image will be retained unless you select a new one.
                            </p>
                        )}
                    </div>

                    {/* Read time */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Read Time (minutes) <span className="text-[#D2252B]">*</span>
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={60}
                            value={form.readTimeMinutes}
                            onChange={(e) => set("readTimeMinutes", Number(e.target.value))}
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 transition"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Between 1 and 60 minutes</p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                            Content <span className="text-[#D2252B]">*</span>
                        </label>
                        <textarea
                            rows={10}
                            value={form.content}
                            onChange={(e) => set("content", e.target.value)}
                            placeholder="Write the full article content here…"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 transition resize-y placeholder:text-slate-400"
                        />
                    </div>

                    {/* Publish toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <div className="flex items-center gap-2.5">
                            {form.isPublished
                                ? <Eye className="h-4 w-4 text-emerald-600" />
                                : <EyeOff className="h-4 w-4 text-slate-400" />
                            }
                            <div>
                                <p className="text-sm font-semibold text-slate-700">
                                    {form.isPublished ? "Published" : "Draft"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {form.isPublished
                                        ? "Visible to visitors on the public site"
                                        : "Hidden from visitors — save as draft"}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => set("isPublished", !form.isPublished)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isPublished ? "bg-emerald-500" : "bg-slate-200"}`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-6" : "translate-x-1"}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        {isEdit ? "Changes saved immediately after clicking Update" : "Slug auto-generated from title"}
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            disabled={busy}
                            className="px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={busy}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D2252B] hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-60"
                        >
                            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                            {isEdit ? "Update Article" : "Create Article"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */

function StatCard({
    label,
    count,
    icon,
    accent,
}: {
    label: string;
    count: number;
    icon: React.ReactNode;
    accent: string;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">{count}</p>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────── */

function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 animate-pulse">
            <div className="w-14 h-10 rounded-lg bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3 w-48 bg-slate-200 rounded" />
                <div className="h-2.5 w-24 bg-slate-100 rounded" />
            </div>
            <div className="h-5 w-20 bg-slate-200 rounded-full hidden sm:block" />
            <div className="h-5 w-14 bg-slate-100 rounded hidden md:block" />
            <div className="h-5 w-16 bg-slate-100 rounded hidden lg:block" />
            <div className="flex gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
                <div className="w-8 h-8 rounded-lg bg-slate-200" />
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

    const [formOpen, setFormOpen] = useState(false);
    const [editItem, setEditItem] = useState<NewsItem | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    /* ── Fetch ── */
    const fetchNews = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const res = await adminGetNews();
            const raw: NewsItem[] = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            setNews(raw);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Failed to load news";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchNews(); }, [fetchNews]);

    /* ── Derived ── */
    const totalPublished = news.filter((n) => n.isPublished).length;
    const totalDrafts = news.filter((n) => !n.isPublished).length;

    const filtered = news.filter((n) => {
        const matchStatus =
            filterStatus === "ALL" ||
            (filterStatus === "PUBLISHED" && n.isPublished) ||
            (filterStatus === "DRAFT" && !n.isPublished);
        const s = search.toLowerCase();
        const matchSearch =
            !s || n.title.toLowerCase().includes(s) || n.category.toLowerCase().includes(s);
        return matchStatus && matchSearch;
    });

    /* ── Delete ── */
    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            setDeleting(true);
            await adminDeleteNews(deleteTarget.id);
            toast.success("Article deleted");
            setDeleteTarget(null);
            setNews((prev) => prev.filter((n) => n.id !== deleteTarget.id));
        } catch (e: unknown) {
            toast.error(e instanceof Error ? e.message : "Failed to delete article");
        } finally {
            setDeleting(false);
        }
    };

    /* ── Quick toggle publish ── */
    const handleTogglePublish = async (item: NewsItem) => {
        try {
            const formData = new FormData();

            formData.append("title", item.title);
            formData.append("category", item.category);
            formData.append("content", item.content);
            formData.append(
                "readTimeMinutes",
                String(item.readTimeMinutes)
            );
            formData.append(
                "isPublished",
                String(!item.isPublished)
            );

            // No image field:
            // Backend will retain the existing image URL.

            const updated = await adminUpdateNews(
                item.id,
                formData
            );

            const updatedItem: NewsItem =
                updated?.data ?? {
                    ...item,
                    isPublished: !item.isPublished,
                };

            setNews((prev) =>
                prev.map((n) =>
                    n.id === item.id ? updatedItem : n
                )
            );

            toast.success(
                updatedItem.isPublished
                    ? "Article published"
                    : "Article moved to draft"
            );
        } catch (e: unknown) {
            toast.error(
                e instanceof Error
                    ? e.message
                    : "Failed to update status"
            );
        }
    };

    /* ── Error state ── */
    if (!loading && error && news.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                    <AlertCircle className="h-7 w-7 text-[#D2252B]" />
                </div>
                <p className="text-base font-bold text-slate-800">Failed to load news</p>
                <p className="text-sm text-slate-400 max-w-xs">{error}</p>
                <button
                    onClick={fetchNews}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-red-700 transition"
                >
                    <RefreshCw className="h-4 w-4" /> Retry
                </button>
            </div>
        );
    }

    return (
        <>
            {/* ── Modals ── */}
            <NewsFormModal
                open={formOpen}
                editItem={editItem}
                onClose={() => { setFormOpen(false); setEditItem(null); }}
                onSuccess={fetchNews}
            />
            <ConfirmDeleteModal
                open={deleteTarget !== null}
                title={deleteTarget?.title ?? ""}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                busy={deleting}
            />

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-[#D2252B] mb-1">
                        Admin Panel
                    </p>
                    <h1 className="text-2xl font-extrabold text-slate-900">News Management</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Create, manage and publish news and stories from the foundation.
                    </p>
                </div>
                <button
                    onClick={() => { setEditItem(null); setFormOpen(true); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-red-700 text-white text-sm font-semibold transition shadow-sm self-start sm:self-auto shrink-0"
                >
                    <Plus className="h-4 w-4" /> Create Article
                </button>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                    label="Total Articles"
                    count={news.length}
                    icon={<FileText className="h-5 w-5 text-blue-600" />}
                    accent="bg-blue-50"
                />
                <StatCard
                    label="Published"
                    count={totalPublished}
                    icon={<Eye className="h-5 w-5 text-emerald-600" />}
                    accent="bg-emerald-50"
                />
                <StatCard
                    label="Drafts"
                    count={totalDrafts}
                    icon={<EyeOff className="h-5 w-5 text-amber-600" />}
                    accent="bg-amber-50"
                />
            </div>

            {/* ── Filter + search bar ── */}
            <div className="flex flex-wrap gap-3 mb-5">
                {/* Status filter */}
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                    <Filter className="h-3 w-3 text-slate-300 ml-1" />
                    {(["ALL", "PUBLISHED", "DRAFT"] as FilterStatus[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${filterStatus === s
                                ? s === "PUBLISHED"
                                    ? "bg-emerald-600 text-white"
                                    : s === "DRAFT"
                                        ? "bg-amber-500 text-white"
                                        : "bg-[#D2252B] text-white"
                                : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by title or category…"
                        className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-[#D2252B] focus:ring-2 focus:ring-red-100 placeholder:text-slate-400 shadow-sm transition"
                    />
                </div>

                {/* Refresh */}
                <button
                    onClick={fetchNews}
                    className="inline-flex items-center gap-1.5 border border-slate-200 bg-white px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
                >
                    <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span className="hidden sm:inline">Refresh</span>
                </button>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Table header — desktop */}
                {!loading && filtered.length > 0 && (
                    <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100">
                        <div className="w-14" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Article</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-24 text-center">Status</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-20 text-center">Read</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-center">Published</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider w-28 text-right">Actions</p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <>
                        {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
                    </>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="py-20 flex flex-col items-center gap-4 px-6 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-slate-300" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-400">
                                {search || filterStatus !== "ALL" ? "No articles match your filters" : "No news articles yet"}
                            </p>
                            <p className="text-xs text-slate-300 mt-1">
                                {search || filterStatus !== "ALL"
                                    ? "Try adjusting your search or filter"
                                    : "Create your first news article to share foundation updates with visitors."}
                            </p>
                        </div>
                        {!search && filterStatus === "ALL" && (
                            <button
                                onClick={() => { setEditItem(null); setFormOpen(true); }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] text-white text-sm font-semibold hover:bg-red-700 transition"
                            >
                                <Plus className="h-4 w-4" /> Create Article
                            </button>
                        )}
                    </div>
                )}

                {/* Rows */}
                {!loading && filtered.map((item) => (
                    <div
                        key={item.id}
                        className="flex flex-col sm:flex-row md:grid md:grid-cols-[auto_1fr_auto_auto_auto_auto] md:items-center gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition"
                    >
                        {/* Thumbnail */}
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-slate-400" />
                                </div>
                            )}
                        </div>

                        {/* Title + category */}
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                    {item.category}
                                </span>
                                {/* Mobile: show status inline */}
                                <span className="md:hidden">
                                    <StatusBadge published={item.isPublished} />
                                </span>
                            </div>
                        </div>

                        {/* Status — desktop */}
                        <div className="hidden md:flex w-24 justify-center">
                            <StatusBadge published={item.isPublished} />
                        </div>

                        {/* Read time */}
                        <div className="hidden md:flex w-20 justify-center items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {item.readTimeMinutes} min
                        </div>

                        {/* Published date */}
                        <div className="hidden md:block w-28 text-center">
                            <span className="text-xs text-slate-500">{fmtDate(item.publishedAt)}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 md:w-28 md:justify-end shrink-0">
                            {/* Quick publish toggle */}
                            <button
                                onClick={() => handleTogglePublish(item)}
                                title={item.isPublished ? "Move to Draft" : "Publish"}
                                className={`w-8 h-8 flex items-center justify-center rounded-xl border transition ${item.isPublished
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                    : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                                    }`}
                            >
                                {item.isPublished ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                            </button>

                            {/* Edit */}
                            <button
                                onClick={() => { setEditItem(item); setFormOpen(true); }}
                                title="Edit"
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition"
                            >
                                <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                                onClick={() => setDeleteTarget(item)}
                                title="Delete"
                                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-[#D2252B] transition"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Footer */}
                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Showing <span className="font-bold text-slate-600">{filtered.length}</span> of{" "}
                            <span className="font-bold text-slate-600">{news.length}</span> articles
                        </p>
                        {(search || filterStatus !== "ALL") && (
                            <button
                                onClick={() => { setSearch(""); setFilterStatus("ALL"); }}
                                className="text-xs text-[#D2252B] font-semibold hover:text-red-700 transition"
                            >
                                Clear filters ×
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
