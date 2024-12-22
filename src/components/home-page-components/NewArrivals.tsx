import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../shadcn-ui/carousel";
import { Card, CardContent, CardFooter, CardTitle } from "../shadcn-ui/card";
import { Button } from "../shadcn-ui/button";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

async function fetchNewArrivals(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?limit=8&sortBy=createdAt&sortOrder=desc`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 120 },
      // cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch new arrivals");
  const data = await res.json();
  return data.data.data;
}

export default async function NewArrivals() {
  const newArrivals = await fetchNewArrivals();

  return (
    <section className="mb-14">
      <h2 className="text-3xl font-bold mb-6 text-primary">New Arrivals</h2>
      <Carousel
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
          {newArrivals.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 pl-4"
            >
              <Card className="group">
                <CardContent className="p-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-[200px] object-cover rounded-md duration-300 transition-transform group-hover:scale-105"
                  />
                </CardContent>
                <CardFooter className="flex flex-col items-start">
                  <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                  <p className="text-xl font-bold">
                    ${product.price.toFixed(2)}
                  </p>
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
    </section>
  );
}
