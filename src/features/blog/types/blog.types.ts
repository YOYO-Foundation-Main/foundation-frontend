export interface Blog {
  id: number;
  title: string;
  content: string;
  image: string;
  author: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  total: number;
  page: number;
  limit: number;
  data: Blog[];
}

