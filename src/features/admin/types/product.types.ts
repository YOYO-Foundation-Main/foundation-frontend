export interface Product {
  id: number;
  name: string;
  price: number;
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

