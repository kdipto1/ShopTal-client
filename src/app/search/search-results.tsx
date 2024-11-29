import React from "react";

import { searchProducts } from "@/lib/api";
import { SearchParams } from "@/types";
import { ProductCard } from "@/components/search-page-components/ProductCard";
import { Pagination } from "@/components/search-page-components/Pagination";

interface SearchResultsProps {
  searchParams: SearchParams;
}

export default async function SearchResults({
  searchParams,
}: SearchResultsProps) {
  const {
    data: { data: products, totalPages, currentPage },
  } = await searchProducts(searchParams);

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">No products found</h2>
        <p className="text-gray-600 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
      />
    </div>
  );
}
