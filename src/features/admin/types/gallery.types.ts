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