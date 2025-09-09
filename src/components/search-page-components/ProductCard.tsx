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
    <Card className="flex flex-col h-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl bg-white dark:bg-gray-950 animate-fadein overflow-hidden group">
      <CardHeader className="p-0">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-40 sm:h-44 md:h-36 object-contain rounded-t-xl bg-white group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grow flex flex-col justify-between">
        <div>
          <CardTitle className="text-sm sm:text-base font-semibold line-clamp-2 text-gray-900 dark:text-white mb-2 leading-tight">
            {product.name}
          </CardTitle>
          <p className="text-pink-600 font-bold text-lg sm:text-xl">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          asChild
          className="w-full h-10 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md text-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
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
