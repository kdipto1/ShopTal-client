// import { Button } from "@/components/shadcn-ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/shadcn-ui/card";
// import Image from "next/image";
// import Link from "next/link";

// async function searchProducts(
//   query: string,
//   category: string,
//   minPrice: number,
//   maxPrice: number,
//   page: number
// ) {
//   const params = new URLSearchParams({
//     q: query,
//     category: category,
//     minPrice: minPrice.toString(),
//     maxPrice: maxPrice.toString(),
//     page: page.toString(),
//   });

//   const res = await fetch(`http://localhost:5000/api/v1/products?${params}`);
//   if (!res.ok) throw new Error("Failed to fetch products");
//   return res.json();
// }

// export default async function SearchResults({
//   query,
//   category,
//   minPrice,
//   maxPrice,
//   page,
// }: {
//   query: string;
//   category: string;
//   minPrice: number;
//   maxPrice: number;
//   page: number;
// }) {
//   const { products, totalPages } = await searchProducts(
//     query,
//     category,
//     minPrice,
//     maxPrice,
//     page
//   );

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         {products?.data.data.map((product: any) => (
//           <Card key={product._id}>
//             <CardHeader className="p-0">
//               <Image
//                 src={product.image || "/placeholder.svg?height=200&width=200"}
//                 alt={product.name}
//                 width={200}
//                 height={200}
//                 className="w-full h-48 object-cover"
//               />
//             </CardHeader>
//             <CardContent className="p-4">
//               <CardTitle className="text-lg">{product.name}</CardTitle>
//               <p className="text-xl font-bold mt-2">
//                 ${product.price.toFixed(2)}
//               </p>
//             </CardContent>
//             <CardFooter>
//               <Button asChild className="w-full">
//                 <Link href={`/product/${product._id}`}>View Details</Link>
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//       <div className="flex justify-center space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//           <Button
//             key={pageNum}
//             variant={pageNum === page ? "default" : "outline"}
//             asChild
//           >
//             <Link
//               href={`/search?q=${query}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${pageNum}`}
//             >
//               {pageNum}
//             </Link>
//           </Button>
//         ))}
//       </div>
//     </div>
//   );
// }

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
