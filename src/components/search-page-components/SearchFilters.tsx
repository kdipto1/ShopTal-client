// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/shadcn-ui/card";
// import { Input } from "@/components/shadcn-ui/input";
// import { Checkbox } from "@/components/shadcn-ui/checkbox";
// import { Button } from "@/components/shadcn-ui/button";
// import { Category, SearchParams } from "@/types";

// interface SearchFiltersProps {
//   categories: Category[];
//   currentFilters: SearchParams;
// }

// export const SearchFilters: React.FC<SearchFiltersProps> = ({
//   categories,
//   currentFilters,
// }) => (
//   <Card>
//     <CardHeader>
//       <CardTitle>Filters</CardTitle>
//     </CardHeader>
//     <CardContent>
//       <form action="/search" className="space-y-6">
//         <div>
//           <Input
//             type="text"
//             name="searchTerm"
//             placeholder="Search products..."
//             defaultValue={currentFilters.searchTerm}
//             className="w-full"
//           />
//         </div>

//         <div className="space-y-2">
//           <h3 className="font-semibold">Categories</h3>
//           <div className="space-y-2">
//             {categories.map((cat) => (
//               <div key={cat.id} className="flex items-center space-x-2">
//                 <Checkbox
//                   id={`category-${cat.id}`}
//                   name="categoryId"
//                   value={cat.id}
//                   defaultChecked={currentFilters.category === cat.id}
//                 />
//                 <label
//                   htmlFor={`category-${cat.id}`}
//                   className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                 >
//                   {cat.name}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="space-y-2">
//           <h3 className="font-semibold">Price Range</h3>
//           <div className="flex items-center space-x-2">
//             <Input
//               type="number"
//               name="minPrice"
//               placeholder="Min"
//               defaultValue={currentFilters.minPrice}
//               className="w-24"
//             />
//             <span>to</span>
//             <Input
//               type="number"
//               name="maxPrice"
//               placeholder="Max"
//               defaultValue={currentFilters.maxPrice}
//               className="w-24"
//             />
//           </div>
//         </div>

//         <Button type="submit" className="w-full">
//           Apply Filters
//         </Button>
//       </form>
//     </CardContent>
//   </Card>
// );

/**** */

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
}

export function SearchFilters({
  categories,
  currentFilters,
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
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-none rounded-xl p-3 md:p-4 bg-white dark:bg-gray-950">
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
              className="w-full text-sm rounded-md border border-gray-200 dark:border-gray-800 focus:ring-1 focus:ring-pink-200"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wide">
              Categories
            </h3>
            <div className="space-y-1">
              {categories?.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={filters.categoryId === cat.id}
                    onCheckedChange={() => handleCategoryChange(cat.id)}
                    className="h-4 w-4 border-gray-300 dark:border-gray-700"
                  />
                  <label
                    htmlFor={`category-${cat.id}`}
                    className="text-xs text-gray-700 dark:text-gray-200 font-normal"
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
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleInputChange}
                className="w-20 text-sm rounded-md border border-gray-200 dark:border-gray-800"
              />
              <span className="text-xs text-gray-400">to</span>
              <Input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleInputChange}
                className="w-20 text-sm rounded-md border border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
          >
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
