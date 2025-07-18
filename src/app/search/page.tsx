import React, { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { SearchParams } from "@/types";
import { SearchFilters } from "@/components/search-page-components/SearchFilters";
import SearchResults from "@/components/search-page-components/SearchResults";

interface SearchPageProps {
  searchParams: { [key: string]: string | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const parsedParams: SearchParams = {
    searchTerm: searchParams.searchTerm,
    category: searchParams.category,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page: searchParams.page ? Number(searchParams.page) : 1,
    limit: searchParams.limit ? Number(searchParams.limit) : 10,
    categoryId: searchParams.categoryId,
    subcategoryId: searchParams.subcategoryId,
    brandId: searchParams.brandId,
  };

  const {
    data: { data: categories },
  } = await getCategories({ limit: 20 });

  return (
    <div className="container mx-auto px-2 py-6 min-h-[70vh] bg-white dark:bg-gray-950">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
        Search Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <div className="md:col-span-1 md:sticky md:top-24 h-fit">
          <SearchFilters
            categories={categories}
            currentFilters={parsedParams}
          />
        </div>
        <div className="md:col-span-3">
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading products...</p>
                </div>
              </div>
            }
          >
            <SearchResults searchParams={parsedParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
