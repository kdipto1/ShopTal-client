import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../shadcn-ui/card";
import { Button } from "../shadcn-ui/button";
import Link from "next/link";
import { ProductCard } from "../search-page-components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

async function fetchRandomProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?random=true&limit=8`,
    // { cache: "no-store" },
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch random products");
  const data = await res.json();
  return data.data.data;
}

export default async function RandomProducts() {
  const randomProducts = await fetchRandomProducts();

  return (
    <section className="mb-14">
      <h2 className="text-3xl font-bold mb-6 text-primary">Discover More</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {randomProducts.map((product) => (
          <Card
            className="flex flex-col h-full group border border-pink-100 hover:border-pink-400 shadow-sm hover:shadow-md transition-all duration-200 bg-white rounded-xl overflow-hidden"
            key={product.id}
          >
            <CardHeader className="p-0 relative bg-gradient-to-br from-pink-50 to-white h-40 flex items-center justify-center">
              <Link
                href={`/product/${product.id}`}
                className="block w-full h-full"
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-40 object-contain rounded-md duration-200 transition-transform group-hover:scale-105 bg-white z-10"
                    priority={false}
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-pink-100 text-pink-400 text-4xl font-bold rounded-md z-10">
                    <span>{product.name.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </Link>
            </CardHeader>
            <CardContent className="p-3 grow flex flex-col justify-between z-20">
              <CardTitle className="text-base mb-1 font-semibold group-hover:text-pink-600 transition-colors duration-150 line-clamp-2">
                {product.name.length > 26
                  ? product.name.slice(0, 26) + "..."
                  : product.name}
              </CardTitle>
              <p className="text-lg font-bold text-pink-600 mt-1">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-3 z-20 hidden md:block">
              <Button
                asChild
                className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 transition-colors duration-150 text-sm py-2"
              >
                <Link href={`/product/${product.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
