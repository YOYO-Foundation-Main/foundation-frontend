"use client";

import {
    adminCreateGallery,
    adminDeleteGallery,
    adminGetGallery,
    adminToggleFeaturedGallery,
} from "@/features/admin/api/admin.api";

import { useEffect, useState } from "react";

type GalleryImage = {
    id: number;
    image: string;
};

type Gallery = {
    id: number;
    title: string;
    description?: string;
    isFeatured: boolean;
    images: GalleryImage[];
};

export default function GalleryPage() {
    const [gallery, setGallery] = useState<Gallery[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");

    const [files, setFiles] =
        useState<FileList | null>(null);

    const [loading, setLoading] =
        useState(false);

    const loadGallery = async () => {
        try {
            const res =
                await adminGetGallery();

            setGallery(res.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadGallery();
    }, []);

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "title",
                title
            );

            formData.append(
                "description",
                description
            );

            if (files) {
                Array.from(files).forEach(
                    (file) => {
                        formData.append(
                            "images",
                            file
                        );
                    }
                );
            }

            await adminCreateGallery(
                formData
            );

            setTitle("");
            setDescription("");

            loadGallery();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (
        id: number
    ) => {
        if (
            !confirm(
                "Delete this gallery?"
            )
        ) {
            return;
        }

        try {
            await adminDeleteGallery(id);

            loadGallery();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-2xl font-bold">
                    Gallery Management
                </h1>
            </div>

            {/* <form
                onSubmit={handleSubmit}
                className="space-y-4 border p-5 rounded-xl bg-white"
            >
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full border rounded-lg p-3"
                    value={title}
                    onChange={(e) =>
                        setTitle(
                            e.target.value
                        )
                    }
                />

                <textarea
                    placeholder="Description"
                    className="w-full border rounded-lg p-3"
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) =>
                        setFiles(
                            e.target.files
                        )
                    }
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg"
                >
                    {loading
                        ? "Uploading..."
                        : "Create Gallery"}
                </button>
            </form> */}

            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl border p-6 space-y-5"
            >

                <h2 className="text-lg font-semibold">
                    Upload Gallery
                </h2>

                <input
                    type="text"
                    placeholder="Gallery Title"
                    className="w-full border rounded-xl p-3"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

                <div className="space-y-3">

                    <label className="block text-sm font-medium text-gray-700">
                        Gallery Images
                    </label>

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="gallery-images"
                        onChange={(e) => {

                            const selectedFiles = e.target.files;

                            setFiles(selectedFiles);

                            if (selectedFiles) {

                                const previews =
                                    Array.from(selectedFiles).map((file) =>
                                        URL.createObjectURL(file)
                                    );

                                setPreviewImages(previews);
                            }
                        }}
                    />

                    <label
                        htmlFor="gallery-images"
                        className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-red-500 transition"
                    >
                        <div className="text-center">

                            <p className="font-medium">
                                Click to upload images
                            </p>

                            <p className="text-sm text-gray-500">
                                Select multiple images
                            </p>

                        </div>
                    </label>

                    {previewImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">

                            {previewImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt=""
                                    className="h-24 w-full rounded-lg object-cover border"
                                />
                            ))}

                        </div>
                    )}

                    <p className="text-sm text-gray-500">
                        {previewImages.length} image(s) selected
                    </p>

                </div>

                <textarea
                    placeholder="Gallery Description"
                    rows={4}
                    className="w-full border rounded-xl p-3"
                    value={description}
                    onChange={(e) =>
                        setDescription(e.target.value)
                    }
                />

                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                        setFiles(e.target.files)
                    }
                    className="w-full"
                />

                {files && (
                    <div className="text-sm text-gray-500">
                        {files.length} image(s) selected
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                >
                    {loading
                        ? "Uploading..."
                        : "Create Gallery"}
                </button>

            </form>

            {/* <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="border rounded-xl overflow-hidden bg-white"
          >
            {item.images?.[0] && (
              <img
                src={
                  item.images[0]
                    .image
                }
                alt=""
                className="h-52 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h3 className="font-bold">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {
                  item.description
                }
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    handleDelete(
                      item.id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div> */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {gallery.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition"
                    >
                        {/* Cover Image */}

                        {item.images?.length > 0 && (
                            <img
                                src={item.images[0].image}
                                alt={item.title}
                                className="w-full h-56 object-cover"
                            />
                        )}

                        <div className="p-5">

                            <div className="flex items-center justify-between mb-3">

                                <h3 className="font-semibold text-lg">
                                    {item.title}
                                </h3>

                                {item.isFeatured && (
                                    <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-500 line-clamp-2">
                                {item.description}
                            </p>

                            {/* Gallery Images Count */}

                            <div className="mt-4 text-sm text-gray-500">
                                {item.images?.length || 0} Images
                            </div>

                            {/* Preview Images */}

                            <div className="flex gap-2 mt-4">
                                {item.images
                                    ?.slice(0, 4)
                                    .map((img) => (
                                        <img
                                            key={img.id}
                                            src={img.image}
                                            alt=""
                                            className="h-14 w-14 rounded-lg object-cover border"
                                        />
                                    ))}
                            </div>

                            {/* Actions */}

                            <div className="flex gap-2 mt-5">

                                <button
                                    onClick={async () => {
                                        try {
                                            await adminToggleFeaturedGallery(
                                                item.id
                                            );

                                            loadGallery();
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${item.isFeatured
                                        ? "bg-yellow-500 text-white"
                                        : "bg-gray-100 text-gray-700"
                                        }`}
                                >
                                    {item.isFeatured
                                        ? "Remove Featured"
                                        : "Make Featured"}
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(item.id)
                                    }
                                    className="px-4 py-2 rounded-lg bg-red-500 text-white"
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}