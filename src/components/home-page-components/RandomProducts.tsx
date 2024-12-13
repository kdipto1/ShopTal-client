import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "../shadcn-ui/card";
import { Button } from "../shadcn-ui/button";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

async function fetchRandomProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?random=true`,
    // { cache: "no-store" },
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("Failed to fetch random products");
  const data = await res.json();
  return data.data.data;
}

export default async function RandomProducts() {
  const randomProducts = await fetchRandomProducts();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Discover More</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {randomProducts.map((product) => (
          <Card key={product.id} className="group">
            <CardContent className="p-4">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-[200px] object-cover rounded-md transition-transform group-hover:scale-105"
              />
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <p className="text-xl font-bold mb-2">
                ${product.price.toFixed(2)}
              </p>
              <Link href={`/product/${product.id}`}>
                <Button className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
