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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn-ui/tooltip";

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
      className="relative"
    >
      <div className="block md:hidden absolute -top-10 right-20">
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <CarouselContent>
        {newArrivals?.newArrivals?.map((product) => (
          <CarouselItem
            key={product.id}
            // className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 pl-4"
            className="basis-11/12 sm:basis-3/5 md:basis-1/2 lg:basis-4/12 pl-4"
          >
            <Card className="group">
              <CardHeader className="p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  // objectFit="none"
                  className="w-full h-48 object-contain rounded-md duration-300 transition-transform group-hover:scale-110"
                />
              </CardHeader>
              <CardContent className="flex-grow p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CardTitle className="text-lg mb-2">
                        {product.name.length > 26
                          ? product.name.slice(0, 26) + "..."
                          : product.name}
                      </CardTitle>
                    </TooltipTrigger>
                    <TooltipContent
                      align="start"
                      className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                    >
                      {product.name}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <p className="text-xl font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Link href={`/product/${product.id}`}>
                  <Button className="mt-2">View Details</Button>
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
