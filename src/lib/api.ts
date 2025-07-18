import { NavbarCategory } from "@/components/shared-components/navbar-components/MobileNavbar";
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
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res?.statusText || ""}`);
  }
  // console.log(res);
  return res.json();
}

export const getCategories = (params: any) =>
  fetchAPI<PaginatedResponse<Category>>("/categories", {
    ...params,
  });

export const searchProducts = (params: SearchParams) =>
  fetchAPI<PaginatedResponse<Product>>("/products", {
    searchTerm: params.searchTerm || "",
    category: params.category || "",
    minPrice: params.minPrice?.toString() || "",
    maxPrice: params.maxPrice?.toString() || "",
    page: params.page?.toString() || "1",
    limit: params.limit?.toString() || "10",
    categoryId: params.categoryId || "",
    subcategoryId: params.subcategoryId || "",
    brandId: params.brandId || "",
  });

export async function fetchCategories(): Promise<NavbarCategory[]> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/categories/navbar-category`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createOrderAPI<T>(
  endpoint: string,
  payload: any,
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export async function applyCouponAPI<T>(
  endpoint: string,
  payload: { couponCode: string; totalAmount: number },
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}

export async function createPaymentIntentAPI<T>(
  endpoint: string,
  payload: { amount: number },
  accessToken: string
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `API Error: ${res?.statusText || ""}`);
  }

  return res.json();
}
