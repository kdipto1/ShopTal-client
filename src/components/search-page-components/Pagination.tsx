import React from "react";
import Link from "next/link";
import { Button } from "@/components/shadcn-ui/button";
import { SearchParams } from "@/types";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: SearchParams;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  searchParams,
}) => {
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
      page: page.toString(),
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
    </div>
  );
};
