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

    // Build query string
    const queryParams = new URLSearchParams();

    // Add non-empty filters to query
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    // Navigate with new search params
    router.push(`/search?${queryParams.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              name="searchTerm"
              placeholder="Search products..."
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${cat.id}`}
                    checked={filters.categoryId === cat.id}
                    onCheckedChange={() => handleCategoryChange(cat.id)}
                  />
                  <label
                    htmlFor={`category-${cat.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cat.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Price Range</h3>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleInputChange}
                className="w-24"
              />
              <span>to</span>
              <Input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleInputChange}
                className="w-24"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
