"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Button } from "@/components/shadcn-ui/button";
import { Category, SearchParams } from "@/types";

interface SearchFiltersProps {
  categories: Category[];
  currentFilters: SearchParams;
  onFiltersChange?: (filters: Partial<SearchParams>) => void;
}

export function SearchFilters({
  categories,
  currentFilters,
  onFiltersChange,
}: SearchFiltersProps) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    searchTerm: currentFilters.searchTerm || "",
    categoryId: currentFilters.categoryId || "",
    minPrice: currentFilters.minPrice || "",
    maxPrice: currentFilters.maxPrice || "",
  });

  useEffect(() => {
    setFilters({
      searchTerm: currentFilters.searchTerm || "",
      categoryId: currentFilters.categoryId || "",
      minPrice: currentFilters.minPrice || "",
      maxPrice: currentFilters.maxPrice || "",
    });
  }, [currentFilters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onFiltersChange) {
      // Use the callback if provided (for client-side filtering)
      const newFilters: Partial<SearchParams> = {
        searchTerm: filters.searchTerm || undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      };
      onFiltersChange(newFilters);
    } else {
      // Fallback to URL navigation (for backward compatibility)
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      router.push(`/search?${queryParams.toString()}`);
    }
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-none rounded-xl p-4 md:p-4 bg-white dark:bg-gray-950">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Input
              type="text"
              name="searchTerm"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="w-full h-12 text-base rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors duration-200"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Categories
            </h3>
            <div className="space-y-2">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={filters.categoryId === cat.id}
                    onCheckedChange={() => handleCategoryChange(cat.id)}
                    className="h-5 w-5 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                  />
                  <label
                    htmlFor={`category-${cat.id}`}
                    className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer flex-1"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Price Range
            </h3>
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleInputChange}
                className="flex-1 h-10 text-base rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 font-medium">to</span>
              <Input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleInputChange}
                className="flex-1 h-10 text-base rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors duration-200"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md text-base py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
