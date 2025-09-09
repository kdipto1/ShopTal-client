"use client";

import { useState } from "react";
import { Button } from "@/components/shadcn-ui/button";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Input } from "@/components/shadcn-ui/input";
import { Category, SearchParams } from "@/types";

interface MobileFiltersProps {
  categories: Category[];
  currentFilters: SearchParams;
  onApplyFilters: (filters: Partial<SearchParams>) => void;
  onClose: () => void;
}

export default function MobileFilters({
  categories,
  currentFilters,
  onApplyFilters,
  onClose
}: MobileFiltersProps) {
  const [filters, setFilters] = useState({
    searchTerm: currentFilters.searchTerm || "",
    categoryId: currentFilters.categoryId || "",
    minPrice: currentFilters.minPrice?.toString() || "",
    maxPrice: currentFilters.maxPrice?.toString() || "",
  });

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

  const handleApplyFilters = () => {
    const appliedFilters: Partial<SearchParams> = {
      searchTerm: filters.searchTerm || undefined,
      categoryId: filters.categoryId || undefined,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    };
    onApplyFilters(appliedFilters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <Input
          type="text"
          name="searchTerm"
          placeholder="Search products..."
          value={filters.searchTerm}
          onChange={handleInputChange}
          className="w-full h-12 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Categories
        </label>
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {categories?.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-3">
              <Checkbox
                id={`mobile-category-${cat.id}`}
                checked={filters.categoryId === cat.id}
                onCheckedChange={() => handleCategoryChange(cat.id)}
                className="h-5 w-5 border-gray-300"
              />
              <label
                htmlFor={`mobile-category-${cat.id}`}
                className="text-sm text-gray-700 font-medium cursor-pointer flex-1"
              >
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleInputChange}
              className="w-full h-10 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
            />
          </div>
          <div>
            <Input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleInputChange}
              className="w-full h-10 text-base rounded-lg border-gray-200 focus:ring-2 focus:ring-pink-200 focus:border-pink-300"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handleClearFilters}
          className="flex-1 h-12 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Clear All
        </Button>
        <Button
          onClick={handleApplyFilters}
          className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}