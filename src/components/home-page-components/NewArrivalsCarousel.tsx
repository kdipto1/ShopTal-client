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
      <div className="block md:hidden absolute -top-5 right-20">
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <CarouselContent className="overflow-visible">
        {newArrivals?.newArrivals?.map((product) => (
          <CarouselItem
            key={product.id}
            // className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 pl-4"
            className="basis-11/12 sm:basis-3/5 md:basis-1/2 lg:basis-4/12 pl-4"
          >
            <Card className="group border border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-xl overflow-hidden relative transform-gpu  animate-fade-in-up">
              <CardHeader className="p-3 flex items-center justify-center h-40 bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-40 object-contain rounded-md duration-200 transition-transform group-hover:scale-105 bg-white z-10"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-pink-100 text-pink-400 text-4xl font-bold rounded-md z-10">
                    <span>{product.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </CardHeader>
              <CardContent className="grow p-3 flex flex-col justify-between z-20">
                <CardTitle className="text-base mb-1 font-semibold group-hover:text-pink-600 transition-colors duration-150 line-clamp-2">
                  {product.name.length > 26
                    ? product.name.slice(0, 26) + "..."
                    : product.name}
                </CardTitle>
                <p className="text-lg font-bold text-pink-600 mt-1">
                  ${product.price.toFixed(2)}
                </p>
              </CardContent>
              <CardFooter className="p-3 z-20">
                <Link href={`/product/${product.id}`} className="block w-full">
                  <Button className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 transition-colors duration-150 text-sm py-2">
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
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
