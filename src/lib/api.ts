import { Product, Category, PaginatedResponse, SearchParams } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url.toString(), {
    // next: { revalidate: 60 }
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res?.statusText || ""}`);
  }
  // console.log(res);
  return res.json();
}

export const getCategories = () =>
  fetchAPI<PaginatedResponse<Category>>("/categories");

export const searchProducts = (params: SearchParams) =>
  fetchAPI<PaginatedResponse<Product>>("/products", {
    searchTerm: params.searchTerm || "",
    category: params.category || "",
    minPrice: params.minPrice?.toString() || "",
    maxPrice: params.maxPrice?.toString() || "",
    page: params.page?.toString() || "1",
    categoryId: params.categoryId || "",
    subcategoryId: params.subcategoryId || "",
    brandId: params.brandId || "",
  });
