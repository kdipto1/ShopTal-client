"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn-ui/carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn-ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../shadcn-ui/button";
import Autoplay from "embla-carousel-autoplay";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function NewArrivalsCarousel(newArrivals: {
  newArrivals: Product[];
}) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="relative mt-10"
    >
      <div className="block md:hidden absolute -top-6 right-4 z-10">
        <CarouselPrevious className="h-8 w-8 bg-white/90 hover:bg-white border border-pink-200 shadow-md" />
        <CarouselNext className="h-8 w-8 bg-white/90 hover:bg-white border border-pink-200 shadow-md ml-2" />
      </div>
      <CarouselContent className="overflow-visible">
        {newArrivals?.newArrivals?.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 pl-4"
          >
            <div className="h-full flex">
              <Card className="group border border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl overflow-hidden relative transform-gpu animate-fade-in-up w-full flex flex-col">
              <CardHeader className="p-4 flex items-center justify-center h-44 sm:h-40 bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-44 sm:h-40 object-contain rounded-lg duration-300 transition-transform group-hover:scale-105 bg-white z-10"
                  />
                ) : (
                  <div className="w-full h-44 sm:h-40 flex items-center justify-center bg-pink-100 text-pink-400 text-3xl sm:text-4xl font-bold rounded-lg z-10">
                    <span>{product.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow p-4 flex flex-col justify-between z-20 min-h-[100px]">
                <div className="flex-1">
                  <CardTitle className="text-sm sm:text-base mb-2 font-semibold group-hover:text-pink-600 transition-colors duration-200 line-clamp-2 leading-tight">
                    {product.name.length > 30
                      ? product.name.slice(0, 30) + "..."
                      : product.name}
                  </CardTitle>
                </div>
                <p className="text-lg sm:text-xl font-bold text-pink-600 mt-auto">
                  ${product.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 z-20">
                <Link href={`/product/${product.id}`} className="block w-full">
                  <Button className="w-full h-10 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
