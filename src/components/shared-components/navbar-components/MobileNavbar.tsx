import { Suspense } from "react";
import MobileNavbarMenu from "./MobileNavbarMenu";

interface Brand {
  id: string;
  name: string;
  categoryId?: string;
}

interface ProductSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Category {
  id: string;
  name: string;
  productSubcategory: ProductSubcategory[];
  brands: Brand[];
}

export default async function MobileNavbar() {
  // const { categories, isLoading, error } = useNavigation();

  // if (isLoading) {
  //   return <div className="flex justify-center p-4">Loading navigation...</div>;
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center p-4 text-red-500">
  //       Error loading navigation
  //     </div>
  //   );
  // }

  async function fetchCategories(): Promise<Category[]> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/navbar-category`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          // next: { revalidate: 60 },
        }
      );

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
  const categories = await fetchCategories();
  return <MobileNavbarMenu categories={categories} />;
}
