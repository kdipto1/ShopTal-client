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

export interface LoginResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    role: string;
  };
}

export interface AuthData {
  accessToken: string;
  role: string;
  passwordChangeRequired?: boolean;
}

export interface RouteConfig {
  [path: string]: string[];
}

export interface RedirectOptions {
  passwordChangeRequired?: boolean;
  redirect?: string;
}
