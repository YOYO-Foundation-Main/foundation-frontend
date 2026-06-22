// "use client";

// import {
//     adminCreateGallery,
//     adminUpdateGallery,
//     adminDeleteGallery,
//     adminGetGallery,
//     adminToggleFeaturedGallery,
// } from "@/features/admin/api/admin.api";

// import { useEffect, useState } from "react";

// type GalleryImage = {
//     id: number;
//     image: string;
// };

// type Gallery = {
//     id: number;
//     title: string;
//     description?: string;
//     isFeatured: boolean;
//     images: GalleryImage[];
// };

// export default function GalleryPage() {
//     const [gallery, setGallery] = useState<Gallery[]>([]);
//     const [files, setFiles] =
//         useState<File[]>([]);
//     const [previewImages, setPreviewImages] = useState<string[]>([]);
//     const [title, setTitle] = useState("");
//     const [description, setDescription] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);

//     const loadGallery = async () => {
//         try {
//             const res =
//                 await adminGetGallery();

//             setGallery(res.data || []);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     useEffect(() => {
//         loadGallery();
//     }, []);

//     const handleSubmit = async (
//         e: React.FormEvent
//     ) => {
//         e.preventDefault();

//         try {
//             setLoading(true);

//             const formData =
//                 new FormData();

//             formData.append(
//                 "title",
//                 title
//             );

//             formData.append(
//                 "description",
//                 description
//             );


//             files.forEach((file) => {
//                 formData.append(
//                     "images",
//                     file
//                 );
//             });
//             await adminCreateGallery(
//                 formData
//             );

//             setTitle("");
//             setDescription("");

//             loadGallery();
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleDelete = async (
//         id: number
//     ) => {
//         if (
//             !confirm(
//                 "Delete this gallery?"
//             )
//         ) {
//             return;
//         }

//         try {
//             await adminDeleteGallery(id);

//             loadGallery();
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     return (
//         <div className="space-y-8">

//             <div>
//                 <h1 className="text-2xl font-bold">
//                     Gallery Management
//                 </h1>
//             </div>
//             <form
//                 onSubmit={handleSubmit}
//                 className="bg-white rounded-2xl border p-6 space-y-5"
//             >

//                 <h2 className="text-lg font-semibold">
//                     Upload Gallery
//                 </h2>

//                 <input
//                     type="text"
//                     placeholder="Gallery Title"
//                     className="w-full border rounded-xl p-3"
//                     value={title}
//                     onChange={(e) =>
//                         setTitle(e.target.value)
//                     }
//                 />

//                 <div className="space-y-3">



//                 </div>

//                 <textarea
//                     placeholder="Gallery Description"
//                     rows={4}
//                     className="w-full border rounded-xl p-3"
//                     value={description}
//                     onChange={(e) =>
//                         setDescription(e.target.value)
//                     }
//                 />
//                 <input
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={(e) => {

//                         const selectedFiles =
//                             Array.from(
//                                 e.target.files || []
//                             );

//                         setFiles((prev) => [
//                             ...prev,
//                             ...selectedFiles,
//                         ]);
//                         const newPreviews =
//                             selectedFiles.map((file) =>
//                                 URL.createObjectURL(file)
//                             );

//                         setPreviewImages((prev) => [
//                             ...prev,
//                             ...newPreviews,
//                         ]);
//                         e.target.value = "";
//                     }}
//                 />

//                 {previewImages.length > 0 && (
//                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">

//                         {previewImages.map((image, index) => (
//                             <img
//                                 key={index}
//                                 src={image}
//                                 alt=""
//                                 className="h-24 w-full rounded-lg object-cover border"
//                             />
//                         ))}

//                     </div>
//                 )}

//                 <div>
//                     {files.length} image(s) selected
//                 </div>
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
//                 >
//                     {loading
//                         ? "Uploading..."
//                         : "Create Gallery"}
//                 </button>

//             </form>



//             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//                 {gallery.map((item) => (
//                     <div
//                         key={item.id}
//                         className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition"
//                     >
//                         {/* Cover Image */}

//                         {item.images?.length > 0 && (
//                             <img
//                                 src={item.images[0].image}
//                                 alt={item.title}
//                                 className="w-full h-56 object-cover"
//                             />
//                         )}

//                         <div className="p-5">

//                             <div className="flex items-center justify-between mb-3">

//                                 <h3 className="font-semibold text-lg">
//                                     {item.title}
//                                 </h3>

//                                 {item.isFeatured && (
//                                     <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
//                                         Featured
//                                     </span>
//                                 )}
//                             </div>

//                             <p className="text-sm text-gray-500 line-clamp-2">
//                                 {item.description}
//                             </p>

//                             {/* Gallery Images Count */}

//                             <div className="mt-4 text-sm text-gray-500">
//                                 {item.images?.length || 0} Images
//                             </div>

//                             {/* Preview Images */}

//                             <div className="flex gap-2 mt-4">
//                                 {item.images
//                                     ?.slice(0, 4)
//                                     .map((img) => (
//                                         <img
//                                             key={img.id}
//                                             src={img.image}
//                                             alt=""
//                                             className="h-14 w-14 rounded-lg object-cover border"
//                                         />
//                                     ))}
//                             </div>

//                             {/* Actions */}

//                             <div className="flex gap-2 mt-5">

//                                 <button
//                                     onClick={async () => {
//                                         try {
//                                             await adminToggleFeaturedGallery(
//                                                 item.id
//                                             );

//                                             loadGallery();
//                                         } catch (err) {
//                                             console.error(err);
//                                         }
//                                     }}
//                                     className={`flex-1 py-2 rounded-lg text-sm font-medium ${item.isFeatured
//                                         ? "bg-yellow-500 text-white"
//                                         : "bg-gray-100 text-gray-700"
//                                         }`}
//                                 >
//                                     {item.isFeatured
//                                         ? "Remove Featured"
//                                         : "Make Featured"}
//                                 </button>

//                                 <button
//                                     onClick={() =>
//                                         handleDelete(item.id)
//                                     }
//                                     className="px-4 py-2 rounded-lg bg-red-500 text-white"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>

//                         </div>
//                     </div>
//                 ))}
//             </div>

//         </div>
//     );
// }


//new gallery creation frontend 

"use client";

import {
    adminCreateGallery,
    adminUpdateGallery,
    adminDeleteGallery,
    adminDeleteGalleryImage,
    adminGetGallery,
    adminToggleFeaturedGallery,
} from "@/features/admin/api/admin.api";

import { useEffect, useState, useRef } from "react";
import {
    Plus, Trash2, Star, StarOff, Pencil, X, Upload, ImageIcon,
    Loader2, AlertTriangle, CheckCircle2, Images, LayoutGrid,
    ChevronLeft, ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type GalleryImage = { id: number; image: string };
type Gallery = {
    id: number;
    title: string;
    description?: string;
    isFeatured: boolean;
    images: GalleryImage[];
};
type ConfirmState =
    | { type: "delete"; gallery: Gallery }
    | { type: "feature"; gallery: Gallery }
    | { type: "unfeature"; gallery: Gallery };

// ─────────────────────────────────────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────────────────────────────────────
type ToastItem = { id: number; message: string; type: "success" | "error" };
function Toast({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 bg-white shadow-lg
            ${t.type === "success" ? "border-green-200" : "border-red-200"}`}
                    style={{ animation: "slideIn 0.3s ease" }}
                >
                    <div className={`shrink-0 ${t.type === "success" ? "text-green-500" : "text-[#D2252B]"}`}>
                        {t.type === "success"
                            ? <CheckCircle2 className="h-4 w-4" />
                            : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <p className="text-sm font-medium text-gray-800 flex-1">{t.message}</p>
                    <button onClick={() => remove(t.id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const add = (type: ToastItem["type"], message: string) => {
        const id = Date.now();
        setToasts((p) => [...p, { id, type, message }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
    };
    return { toasts, remove: (id: number) => setToasts((p) => p.filter((t) => t.id !== id)), success: (m: string) => add("success", m), error: (m: string) => add("error", m) };
}

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRM MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmModal({ confirm, onClose, onConfirm, processing }: {
    confirm: ConfirmState | null; onClose: () => void; onConfirm: () => void; processing: boolean;
}) {
    if (!confirm) return null;
    const cfg = {
        delete: { title: "Delete Gallery", icon: <Trash2 className="h-6 w-6 text-[#D2252B]" />, iconBg: "bg-red-100", msg: `Permanently delete "${confirm.gallery.title}"? This cannot be undone.`, btn: "Delete", btnCls: "bg-[#D2252B] hover:bg-[#b81e23]" },
        feature: { title: "Mark as Featured", icon: <Star className="h-6 w-6 text-yellow-500" />, iconBg: "bg-yellow-100", msg: `Mark "${confirm.gallery.title}" as featured? It will be highlighted on the site.`, btn: "Mark Featured", btnCls: "bg-yellow-500 hover:bg-yellow-600" },
        unfeature: { title: "Remove Featured", icon: <StarOff className="h-6 w-6 text-gray-500" />, iconBg: "bg-gray-100", msg: `Remove "${confirm.gallery.title}" from featured?`, btn: "Remove Featured", btnCls: "bg-gray-600 hover:bg-gray-700" },
    }[confirm.type];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>{cfg.icon}</div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{cfg.title}</h3>
                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{cfg.msg}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} disabled={processing} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">Cancel</button>
                    <button onClick={onConfirm} disabled={processing} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60 ${cfg.btnCls}`}>
                        {processing && <Loader2 className="h-4 w-4 animate-spin" />}{cfg.btn}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE LIGHTBOX
// ─────────────────────────────────────────────────────────────────────────────
function Lightbox({ images, startIndex, onClose }: { images: GalleryImage[]; startIndex: number; onClose: () => void }) {
    const [idx, setIdx] = useState(startIndex);
    const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
    const next = () => setIdx((i) => (i + 1) % images.length);
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    });
    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={onClose}><X className="h-7 w-7" /></button>
            <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-2" onClick={(e) => { e.stopPropagation(); prev(); }}><ChevronLeft className="h-6 w-6" /></button>
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 rounded-full p-2" onClick={(e) => { e.stopPropagation(); next(); }}><ChevronRight className="h-6 w-6" /></button>
            <img src={images[idx].image} alt="" className="max-h-[85vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{idx + 1} / {images.length}</p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY FORM (Create / Edit)
// ─────────────────────────────────────────────────────────────────────────────
const MAX_IMAGES = 20;

function GalleryForm({
    initial, onDone, onCancel,
}: {
    initial?: Gallery | null;
    onDone: () => void;
    onCancel: () => void;
}) {
    const toast = useToast();
    const isEdit = !!initial;
    const [title, setTitle] = useState(initial?.title || "");
    const [description, setDescription] = useState(initial?.description || "");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [existingImages, setExistingImages] =
        useState(
            initial?.images || []
        );
    const fileRef = useRef<HTMLInputElement>(null);

    const totalImages = (initial?.images?.length || 0) + files.length;
    const remaining = MAX_IMAGES - (initial?.images?.length || 0);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        const canAdd = MAX_IMAGES - (initial?.images?.length || 0) - files.length;
        const toAdd = selected.slice(0, canAdd);
        if (selected.length > canAdd) {
            toast.error(`Max ${MAX_IMAGES} images allowed. Only ${canAdd} more can be added.`);
        }
        setFiles((p) => [...p, ...toAdd]);
        setPreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
        e.target.value = "";
    };

    const removeNewFile = (index: number) => {
        setFiles((p) => p.filter((_, i) => i !== index));
        setPreviews((p) => p.filter((_, i) => i !== index));
    };
    const handleDeleteExistingImage = async (
        imageId: number
    ) => {

        const confirmed = window.confirm(
            "Remove this image?"
        );

        if (!confirmed) return;

        try {

            await adminDeleteGalleryImage(
                imageId
            );
            setExistingImages((prev) =>
                prev.filter(
                    (img) => img.id !== imageId
                )
            );
            toast.success(
                "Image removed successfully"
            );

            // router.refresh();

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to remove image"
            );
        }
    };
    const validate = () => {
        const e: Record<string, string> = {};
        if (!title.trim()) e.title = "Title is required";
        if (!isEdit && files.length === 0) e.files = "At least one image is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            files.forEach((file) => formData.append("images", file));
            if (isEdit) {
                await adminUpdateGallery(initial!.id, formData);
                toast.success("Gallery updated successfully!");
            } else {
                await adminCreateGallery(formData);
                toast.success("Gallery created successfully!");
            }
            setTimeout(() => onDone(), 600);
        } catch (error: any) {
            toast.error(error?.message || "Failed to save gallery");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toast toasts={toast.toasts} remove={toast.remove} />
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                        Gallery Title <span className="text-[#D2252B]">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); setErrors((p) => { const n = { ...p }; delete n.title; return n; }); }}
                        placeholder="e.g. Annual Camp 2024"
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10 ${errors.title ? "border-red-400 bg-red-50/50" : "border-gray-200"}`}
                    />
                    {errors.title && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-1.5">
                        Description <span className="text-gray-400 text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of this gallery..."
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition resize-none focus:border-[#D2252B] focus:ring-2 focus:ring-[#D2252B]/10"
                    />
                </div>

                {/* File Upload */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            Images {!isEdit && <span className="text-[#D2252B]">*</span>}
                            {isEdit && <span className="text-gray-400 text-xs font-normal">(add more)</span>}
                        </label>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalImages >= MAX_IMAGES ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-500"}`}>
                            {totalImages} / {MAX_IMAGES}
                        </span>
                    </div>

                    {/* Existing images (edit mode) */}
                    {isEdit && initial?.images && initial.images.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-2">Existing images ({initial.images.length})</p>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                {/* {initial.images.map((img) => (

                                    <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                                        <img src={img.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))} */}
                                {existingImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                                    >

                                        <img
                                            src={img.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDeleteExistingImage(
                                                    img.id
                                                )
                                            }
                                            className="
                                                 absolute
                                                top-2
                                                 right-2
                                                 bg-red-500
                                                 hover:bg-red-600
                                                 text-white
                                                 rounded-full
                                                 w-7
                                                 h-7
                                                 flex
                                                 items-center
                                                 justify-center
                                                 opacity-0
                                                 group-hover:opacity-100
                                                 transition
                                                 "
                                        >
                                            ✕
                                        </button>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New file previews */}
                    {previews.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 font-medium mb-2">New images to upload ({previews.length})</p>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#D2252B]/30 group">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(i)}
                                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Drop zone */}
                    {totalImages < MAX_IMAGES && (
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-200 hover:border-[#D2252B]/50 hover:bg-[#D2252B]/5 rounded-xl px-6 py-8 flex flex-col items-center gap-2 cursor-pointer transition-colors"
                        >
                            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                <Upload className="h-5 w-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-600">Click to upload images</p>
                            <p className="text-xs text-gray-400">JPG, PNG, WEBP · Up to {MAX_IMAGES} images total</p>
                            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFiles} />
                        </div>
                    )}

                    {totalImages >= MAX_IMAGES && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                            <p className="text-sm text-amber-700 font-medium">Maximum of {MAX_IMAGES} images reached.</p>
                        </div>
                    )}

                    {errors.files && <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{errors.files}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={onCancel} disabled={loading} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition disabled:opacity-60 shadow-sm shadow-[#D2252B]/20">
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isEdit ? "Update Gallery" : "Create Gallery"}
                    </button>
                </div>
            </form>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY CARD
// ─────────────────────────────────────────────────────────────────────────────
function GalleryCard({
    gallery, onDelete, onToggleFeatured, onEdit,
}: {
    gallery: Gallery;
    onDelete: () => void;
    onToggleFeatured: () => void;
    onEdit: () => void;
}) {
    const [lightbox, setLightbox] = useState<number | null>(null);

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                {/* Cover */}
                <div
                    className="relative h-52 bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => gallery.images?.length > 0 && setLightbox(0)}
                >
                    {gallery.images?.length > 0 ? (
                        <>
                            <img src={gallery.images[0].image} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 rounded-full px-3 py-1">
                                <Images className="h-3.5 w-3.5 text-white" />
                                <span className="text-xs text-white font-medium">{gallery.images.length} photos</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <ImageIcon className="h-10 w-10 text-gray-300" />
                        </div>
                    )}
                    {gallery.isFeatured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-yellow-400 rounded-full px-2.5 py-1">
                            <Star className="h-3 w-3 text-yellow-900 fill-yellow-900" />
                            <span className="text-xs font-bold text-yellow-900">Featured</span>
                        </div>
                    )}
                </div>

                {/* Body */}
                <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base truncate">{gallery.title}</h3>
                    {gallery.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{gallery.description}</p>
                    )}

                    {/* Image strip */}
                    {gallery.images?.length > 1 && (
                        <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
                            {gallery.images.slice(1, 6).map((img, idx) => (
                                <button
                                    key={img.id}
                                    className="h-12 w-12 rounded-lg overflow-hidden border border-gray-100 shrink-0 relative"
                                    onClick={() => setLightbox(idx + 1)}
                                >
                                    <img src={img.image} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                    {idx === 4 && gallery.images.length > 6 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">+{gallery.images.length - 6}</span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-5">
                        <button
                            onClick={onEdit}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>

                        <button
                            onClick={onToggleFeatured}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors
                ${gallery.isFeatured ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            {gallery.isFeatured
                                ? <><StarOff className="h-3.5 w-3.5" /> Unfeature</>
                                : <><Star className="h-3.5 w-3.5" /> Feature</>}
                        </button>

                        <button
                            onClick={onDelete}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-[#D2252B] text-xs font-semibold hover:bg-red-100 transition-colors"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                    </div>
                </div>
            </div>

            {lightbox !== null && (
                <Lightbox images={gallery.images} startIndex={lightbox} onClose={() => setLightbox(null)} />
            )}
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function GalleryPage() {
    const toast = useToast();
    const [gallery, setGallery] = useState<Gallery[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [confirm, setConfirm] = useState<ConfirmState | null>(null);
    const [processing, setProcessing] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<Gallery | null>(null);

    const loadGallery = async () => {
        try {
            const res = await adminGetGallery();
            setGallery(res.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load gallery");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => { loadGallery(); }, []);

    const handleConfirm = async () => {
        if (!confirm) return;
        try {
            setProcessing(true);
            if (confirm.type === "delete") {
                await adminDeleteGallery(confirm.gallery.id);
                toast.success("Gallery deleted successfully");
            } else {
                await adminToggleFeaturedGallery(confirm.gallery.id);
                toast.success(confirm.type === "feature" ? "Marked as featured!" : "Removed from featured");
            }
            await loadGallery();
            setConfirm(null);
        } catch (error: any) {
            toast.error(error?.message || "Action failed");
        } finally {
            setProcessing(false);
        }
    };

    const openEdit = (g: Gallery) => { setEditTarget(g); setShowForm(true); };

    const closeForm = () => { setShowForm(false); setEditTarget(null); };

    const onFormDone = () => { closeForm(); loadGallery(); };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
            <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateX(100%); } to { opacity:1; transform:translateX(0); } }
      `}</style>

            <Toast toasts={toast.toasts} remove={toast.remove} />
            <ConfirmModal confirm={confirm} onClose={() => { if (!processing) setConfirm(null); }} onConfirm={handleConfirm} processing={processing} />

            {/* ── Header ── */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{gallery.length} {gallery.length === 1 ? "gallery" : "galleries"} · max {MAX_IMAGES} images each</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { setEditTarget(null); setShowForm(true); }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition shadow-sm shadow-[#D2252B]/20"
                    >
                        <Plus className="h-4 w-4" /> Create Gallery
                    </button>
                )}
            </div>

            {/* ── Create / Edit Form Panel ── */}
            {showForm && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-[#D2252B]/10 flex items-center justify-center">
                                {editTarget ? <Pencil className="h-4 w-4 text-[#D2252B]" /> : <Plus className="h-4 w-4 text-[#D2252B]" />}
                            </div>
                            <div>
                                <h2 className="font-bold text-gray-900 text-sm">{editTarget ? "Edit Gallery" : "Create New Gallery"}</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{editTarget ? `Editing "${editTarget.title}"` : "Upload up to 20 images"}</p>
                            </div>
                        </div>
                        <button onClick={closeForm} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <GalleryForm initial={editTarget} onDone={onFormDone} onCancel={closeForm} />
                    </div>
                </div>
            )}

            {/* ── Gallery Grid ── */}
            {pageLoading ? (
                <div className="flex items-center justify-center py-24">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 text-[#D2252B] animate-spin" />
                        <p className="text-sm text-gray-500 font-medium">Loading gallery...</p>
                    </div>
                </div>
            ) : gallery.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <LayoutGrid className="h-7 w-7 text-gray-400" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">No galleries yet</h3>
                    <p className="text-sm text-gray-500 mt-1.5 max-w-xs">Create your first gallery to showcase your NGO's work and events.</p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D2252B] hover:bg-[#b81e23] text-white text-sm font-semibold transition"
                    >
                        <Plus className="h-4 w-4" /> Create Gallery
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {gallery.map((item) => (
                        <GalleryCard
                            key={item.id}
                            gallery={item}
                            onEdit={() => openEdit(item)}
                            onDelete={() => setConfirm({ type: "delete", gallery: item })}
                            onToggleFeatured={() => setConfirm({ type: item.isFeatured ? "unfeature" : "feature", gallery: item })}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
