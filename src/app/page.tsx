// import Link from "next/link";

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       Home Page
//       <Link href={"/dashboard"}>dashboard</Link>
//       <Link href={"/login"}>login</Link>
//       <Link href={"/signup"}>Signup</Link>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn-ui/carousel";
// Placeholder types for our data
type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Category = {
  id: string;
  name: string;
  image: string;
};

// Placeholder API functions
const fetchNewArrivals = async (): Promise<Product[]> => {
  // Replace with your actual API call
  return [
    { id: "1", name: "New Product 1", price: 99.99, image: "/placeholder.svg" },
    {
      id: "2",
      name: "New Product 2",
      price: 149.99,
      image: "/placeholder.svg",
    },
    { id: "3", name: "New Product 3", price: 79.99, image: "/placeholder.svg" },
    {
      id: "4",
      name: "New Product 4",
      price: 199.99,
      image: "/placeholder.svg",
    },
  ];
};

const fetchCategories = async (): Promise<Category[]> => {
  // Replace with your actual API call
  return [
    { id: "1", name: "Electronics", image: "/placeholder.svg" },
    { id: "2", name: "Clothing", image: "/placeholder.svg" },
    { id: "3", name: "Home & Garden", image: "/placeholder.svg" },
  ];
};

const fetchRandomProducts = async (): Promise<Product[]> => {
  // Replace with your actual API call
  return [
    {
      id: "5",
      name: "Random Product 1",
      price: 59.99,
      image: "/placeholder.svg",
    },
    {
      id: "6",
      name: "Random Product 2",
      price: 89.99,
      image: "/placeholder.svg",
    },
    {
      id: "7",
      name: "Random Product 3",
      price: 129.99,
      image: "/placeholder.svg",
    },
    {
      id: "8",
      name: "Random Product 4",
      price: 39.99,
      image: "/placeholder.svg",
    },
  ];
};

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const arrivals = await fetchNewArrivals();
      const cats = await fetchCategories();
      const randoms = await fetchRandomProducts();
      setNewArrivals(arrivals);
      setCategories(cats);
      setRandomProducts(randoms);
    };
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner Section */}
      <section className="mb-12">
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Banner"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 bg-black bg-opacity-50 text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Summer Sale
            </h1>
            <p className="text-xl md:text-2xl mb-6">
              Up to 50% off on selected items
            </p>
            <Button size="lg">Shop Now</Button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">New Arrivals</h2>
        <Carousel>
          <CarouselContent>
            {newArrivals.map((product) => (
              <CarouselItem
                key={product.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <Card>
                  <CardContent className="p-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-[200px] object-cover rounded-md"
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col items-start">
                    <CardTitle className="text-lg mb-2">
                      {product.name}
                    </CardTitle>
                    <p className="text-xl font-bold">
                      ${product.price.toFixed(2)}
                    </p>
                    <Button className="mt-2">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group"
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-[200px]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between">
                    View All <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Random Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Discover More</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {randomProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-[200px] object-cover rounded-md"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start">
                <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                <p className="text-xl font-bold mb-2">
                  ${product.price.toFixed(2)}
                </p>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
