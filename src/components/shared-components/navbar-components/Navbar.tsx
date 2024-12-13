// "use client";

// import { usePathname } from "next/navigation";
// import { Separator } from "@/components/shadcn-ui/separator";
// import { Suspense } from "react";
import NavbarMenu from "./NavbarMenu";

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

export default async function Navbar() {
  // const router = usePathname();

  // const shouldHide = router.includes("/dashboard");

  // if (shouldHide) {
  //   return null;
  // }

  /***** */

  // Server-side data fetching function
  async function fetchCategories(): Promise<Category[]> {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(
        `${API_BASE_URL}/categories/navbar-category`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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

  /**** */

  return (
    // <section className="hidden md:block w-full border-b bg-white/95 backdrop-blur relative z-50">
    // <div className="flex h-14 items-center justify-center">
    <NavbarMenu categories={categories} />
    // </div>
    // <Separator />
    // </section>
  );
}
