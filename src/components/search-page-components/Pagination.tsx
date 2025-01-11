"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { SearchParams } from "@/types";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: SearchParams;
  pageLimit: number;
}

export function Pagination({
  currentPage,
  totalPages,
  searchParams,
  pageLimit,
}: PaginationProps) {
  const router = useRouter();
  const generatePageUrl = (page: number) => {
    const params = new URLSearchParams({
      ...(searchParams.searchTerm && { searchTerm: searchParams.searchTerm }),
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.minPrice && {
        minPrice: searchParams.minPrice.toString(),
      }),
      ...(searchParams.maxPrice && {
        maxPrice: searchParams.maxPrice.toString(),
      }),
      ...(searchParams.limit && { limit: searchParams.limit.toString() }),
      page: page.toString(),
    });
    return `/search?${params.toString()}`;
  };

  const generatePageLimitUrl = (limit: number) => {
    const params = new URLSearchParams({
      ...(searchParams.searchTerm && { searchTerm: searchParams.searchTerm }),
      ...(searchParams.category && { category: searchParams.category }),
      ...(searchParams.minPrice && {
        minPrice: searchParams.minPrice.toString(),
      }),
      ...(searchParams.maxPrice && {
        maxPrice: searchParams.maxPrice.toString(),
      }),
      ...(searchParams.page && { page: searchParams.page.toString() }),
      limit: limit.toString(),
    });
    return `/search?${params.toString()}`;
  };

  return (
    <div className="flex justify-center gap-2 flex-wrap">
      {currentPage > 1 && (
        <Button variant="outline" asChild>
          <Link href={generatePageUrl(currentPage - 1)}>Previous</Link>
        </Button>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? "default" : "outline"}
          asChild
        >
          <Link href={generatePageUrl(pageNum)}>{pageNum}</Link>
        </Button>
      ))}

      {currentPage < totalPages && (
        <Button variant="outline" asChild>
          <Link href={generatePageUrl(currentPage + 1)}>Next</Link>
        </Button>
      )}

      <select
        id="quantity"
        value={pageLimit}
        onChange={(e) => {
          e.preventDefault();
          const newLimit = Number(e.target.value);
          router.push(generatePageLimitUrl(newLimit));
        }}
        className="rounded-md border border-gray-300 px-2 py-1"
      >
        {[5, 10, 20, 30, 40, 50].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>
  );
}
