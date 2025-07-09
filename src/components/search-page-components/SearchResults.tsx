"use client";

import { useEffect, useState } from "react";
import { searchProducts } from "@/lib/api";
import { SearchParams } from "@/types";
import { ProductCard } from "@/components/search-page-components/ProductCard";
import { Pagination } from "@/components/search-page-components/Pagination";

interface SearchResultsProps {
  searchParams: SearchParams;
}

export default function SearchResults({ searchParams }: SearchResultsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    searchProducts(searchParams)
      .then((data) => {
        setProducts(data.data.data);
        setMeta(data.data.meta);
      })
      .catch(() => {
        setError("Failed to load products.");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 animate-fadein">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          {error}
        </h2>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 animate-fadein">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          No products found
        </h2>
        <p className="text-gray-400 mt-1 text-sm">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  const currentPage = meta?.page || 1;
  const limit = meta?.limit || 10;
  const totalPages = meta ? Math.ceil(meta.total / limit) : 1;

  return (
    <div className="space-y-4 animate-fadein">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        searchParams={searchParams}
        pageLimit={limit}
      />
      <style jsx global>{`
        .animate-fadein {
          animation: fadein 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadein {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}
