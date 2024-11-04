export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PaginatedResponse<T> {
  data: {
    data: T[];
    total: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface SearchParams {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
}
