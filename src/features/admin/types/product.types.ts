export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId?: number;
  category?: Category | null;

  description: string;
  image: string | null;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  Products: Product[];
}

export interface Category {
  id: number;
  name: string;
};

