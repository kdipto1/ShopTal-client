"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Input } from "@/components/shadcn-ui/input";
import { Checkbox } from "@/components/shadcn-ui/checkbox";
import { Button } from "@/components/shadcn-ui/button";
import { Slider } from "@/components/shadcn-ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn-ui/accordion";
import { ScrollArea } from "@/components/shadcn-ui/scroll-area";
import { Category, SearchParams } from "@/types";

interface Subcategory {
  id: string;
  name: string;
  categoryId?: string;
}

interface Brand {
  id: string;
  categoryId?: string;
  brand: {
    id: string;
    name: string;
  };
}

interface CategoryForFilter
  extends Omit<Category, "productSubcategory" | "brands"> {
  productSubcategory: Subcategory[];
  brands: Brand[];
}

interface SearchFiltersProps {
  categories: CategoryForFilter[];
  currentFilters: SearchParams;
  onFiltersChange?: (filters: Partial<SearchParams>) => void;
}

const MAX_PRICE = 5000;

export function SearchFilters({
  categories,
  currentFilters,
  onFiltersChange,
}: SearchFiltersProps) {
  const [categoryId, setCategoryId] = useState(currentFilters.categoryId || "");
  const [subcategoryId, setSubcategoryId] = useState(
    currentFilters.subcategoryId || ""
  );
  const [brandId, setBrandId] = useState(currentFilters.brandId || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    currentFilters.minPrice || 0,
    currentFilters.maxPrice || MAX_PRICE,
  ]);

  useEffect(() => {
    setCategoryId(currentFilters.categoryId || "");
    setSubcategoryId(currentFilters.subcategoryId || "");
    setBrandId(currentFilters.brandId || "");
    setPriceRange([
      currentFilters.minPrice || 0,
      currentFilters.maxPrice || MAX_PRICE,
    ]);
  }, [currentFilters]);

  const handlePriceInputChange = (index: 0 | 1, value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    const newRange = [...priceRange] as [number, number];
    newRange[index] = Math.min(Math.max(numValue, 0), MAX_PRICE);

    // Ensure min doesn't exceed max and max doesn't go below min
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[1] = newRange[0];
    }

    setPriceRange(newRange);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onFiltersChange) {
      const newFilters: Partial<SearchParams> = {
        categoryId: categoryId || undefined,
        subcategoryId: subcategoryId || undefined,
        brandId: brandId || undefined,
        minPrice: priceRange[0] === 0 ? undefined : priceRange[0],
        maxPrice: priceRange[1] === MAX_PRICE ? undefined : priceRange[1],
      };
      onFiltersChange(newFilters);
    }
  };
  console.log(categories);
  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-none rounded-xl p-4 md:p-4 bg-white dark:bg-gray-950">
      <CardHeader className="pb-2 px-0">
        <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Categories
            </h3>
            <ScrollArea className="h-72">
              <Accordion type="single" collapsible className="w-full">
                {categories?.map((cat) => (
                  <AccordionItem value={cat.id} key={cat.id}>
                    <AccordionTrigger>{cat.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                          <Checkbox
                            id={`category-${cat.id}`}
                            checked={categoryId === cat.id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setCategoryId(cat.id);
                                setSubcategoryId(""); // Clear subcategory when selecting parent category
                              } else {
                                setCategoryId("");
                              }
                            }}
                            className="h-5 w-5 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                          />
                          <label
                            htmlFor={`category-${cat.id}`}
                            className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer flex-1"
                          >
                            All in {cat.name}
                          </label>
                        </div>
                        {cat.productSubcategory?.length > 0 && (
                          <div
                            key={`subcategories-${cat.id}`}
                            className="space-y-2"
                          >
                            <div className="mt-2 mb-1 ml-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Subcategories
                              </span>
                            </div>
                            {cat.productSubcategory.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ml-4"
                              >
                                <Checkbox
                                  id={`subcategory-${sub.id}`}
                                  checked={subcategoryId === sub.id}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSubcategoryId(sub.id);
                                      setCategoryId(cat.id);
                                      setBrandId(""); // Clear brand when selecting subcategory
                                    } else {
                                      setSubcategoryId("");
                                    }
                                  }}
                                  className="h-5 w-5 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                                />
                                <label
                                  htmlFor={`subcategory-${sub.id}`}
                                  className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer flex-1"
                                >
                                  {sub.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}

                        {cat.brands?.length > 0 && (
                          <div key={`brands-${cat.id}`} className="space-y-2">
                            <div className="mt-4 mb-1 ml-2">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Brands
                              </span>
                            </div>
                            {cat.brands.map((brand) => (
                              <div
                                key={brand.brand.id}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ml-4"
                              >
                                <Checkbox
                                  id={`brand-${brand.brand.id}`}
                                  checked={brandId === brand.brand.id}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setBrandId(brand.brand.id);
                                      setCategoryId(cat.id);
                                      setSubcategoryId(""); // Clear subcategory when selecting brand
                                    } else {
                                      setBrandId("");
                                    }
                                  }}
                                  className="h-5 w-5 border-gray-300 dark:border-gray-700 data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                                />
                                <label
                                  htmlFor={`brand-${brand.brand.id}`}
                                  className="text-sm text-gray-700 dark:text-gray-200 font-medium cursor-pointer flex-1"
                                >
                                  {brand.brand.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Price Range
            </h3>
            <Slider
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              max={MAX_PRICE}
              step={10}
              className="my-4"
            />
            <div className="flex items-center space-x-3">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => handlePriceInputChange(0, e.target.value)}
                className="flex-1 h-10 text-base rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors duration-200"
              />
              <span className="text-sm text-gray-500 font-medium">to</span>
              <Input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => handlePriceInputChange(1, e.target.value)}
                className="flex-1 h-10 text-base rounded-lg border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-colors duration-200"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full h-12 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md text-base py-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply Filters
            </Button>
            {(categoryId ||
              subcategoryId ||
              brandId ||
              priceRange[0] > 0 ||
              priceRange[1] < MAX_PRICE) && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCategoryId("");
                  setSubcategoryId("");
                  setBrandId("");
                  setPriceRange([0, MAX_PRICE]);
                  onFiltersChange?.({});
                }}
                className="w-full h-10 text-sm"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
