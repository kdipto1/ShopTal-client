import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col h-full border border-gray-100 dark:border-gray-800 shadow-none hover:shadow-md transition-all duration-200 rounded-lg bg-white dark:bg-gray-950 animate-fadein">
      <CardHeader className="p-0">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={600}
          height={600}
          className="w-full h-36 object-contain rounded-t-lg bg-white"
          priority={false}
        />
      </CardHeader>
      <CardContent className="p-3 grow">
        <CardTitle className="text-base font-semibold line-clamp-2 text-gray-900 dark:text-white">
          {product.name}
        </CardTitle>
        <p className="text-pink-600 font-bold mt-1 text-lg">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-3">
        <Button
          asChild
          className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
        >
          <Link href={`/product/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
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
    </Card>
  );
}
