// import { Suspense } from "react";

// import SearchResults from "./search-results";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/shadcn-ui/card";
// import { Input } from "@/components/shadcn-ui/input";
// import { Checkbox } from "@/components/shadcn-ui/checkbox";
// import { Button } from "@/components/shadcn-ui/button";

// // We'll fetch categories from the API in a separate function
// async function getCategories() {
//   const res = await fetch("http://localhost:5000/api/v1/categories");
//   if (!res.ok) throw new Error("Failed to fetch categories");
//   return await res.json();
// }

// export default async function SearchPage({
//   searchParams,
// }: {
//   searchParams: { [key: string]: string | string[] | undefined };
// }) {
//   const query = (searchParams.q as string) || "";
//   const category = (searchParams.category as string) || "";
//   const minPrice = Number(searchParams.minPrice) || 0;
//   const maxPrice = Number(searchParams.maxPrice) || 1000;
//   const page = Number(searchParams.page) || 1;

//   const categories = await getCategories();
//   console.log(categories);
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Search Products</h1>
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="md:col-span-1">
//           <Card>
//             <CardHeader>
//               <CardTitle>Filters</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form action="/search" method="GET">
//                 <Input
//                   type="text"
//                   name="q"
//                   placeholder="Search products..."
//                   defaultValue={query}
//                   className="mb-4"
//                 />
//                 <div className="space-y-2 mb-4">
//                   <h3 className="font-semibold">Categories</h3>
//                   {categories?.data.data.map((cat: string) => (
//                     <div key={cat} className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`category-${cat}`}
//                         name="category"
//                         value={cat}
//                         defaultChecked={category === cat}
//                       />
//                       <label htmlFor={`category-${cat}`}>{cat}</label>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="space-y-2 mb-4">
//                   <h3 className="font-semibold">Price Range</h3>
//                   <div className="flex items-center space-x-2">
//                     <Input
//                       type="number"
//                       name="minPrice"
//                       placeholder="Min"
//                       defaultValue={minPrice}
//                       className="w-20"
//                     />
//                     <span>to</span>
//                     <Input
//                       type="number"
//                       name="maxPrice"
//                       placeholder="Max"
//                       defaultValue={maxPrice}
//                       className="w-20"
//                     />
//                   </div>
//                 </div>
//                 <Button type="submit">Apply Filters</Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//         <div className="md:col-span-3">
//           <Suspense fallback={<div>Loading...</div>}>
//             <SearchResults
//               query={query}
//               category={category}
//               minPrice={minPrice}
//               maxPrice={maxPrice}
//               page={page}
//             />
//           </Suspense>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { Suspense } from "react";
import SearchResults from "./search-results";

import { getCategories } from "@/lib/api";
import { SearchParams } from "@/types";
import { SearchFilters } from "@/components/search-page-components/SearchFilters";

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
    categoryId: searchParams.categoryId,
    subcategoryId: searchParams.subcategoryId,
    brandId: searchParams.brandId,
  };

  const {
    data: { data: categories },
  } = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">Search Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
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
                  <p className="mt-2">Loading products...</p>
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
