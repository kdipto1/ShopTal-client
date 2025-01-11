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
    `${process.env.NEXT_PUBLIC_API_URL}/products?random=true&limit=16`,
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {randomProducts.map((product) => (
          <Card className="flex flex-col h-full group" key={product.id}>
            <CardHeader className="p-0">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-48 object-contain rounded-md duration-300 transition-transform group-hover:scale-110"
                priority={false}
              />
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="text-lg line-clamp-2">
                {product.name}
              </CardTitle>
              <p className="text-xl font-bold mt-2">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-4">
              <Button asChild className="w-full">
                <Link href={`/product/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
          // <Card key={product.id} className="group">
          //   <CardContent className="p-4">
          //     <Image
          //       src={product.image}
          //       alt={product.name}
          //       width={600}
          //       height={600}
          //       className="w-full h-[200px] object-contain rounded-md duration-300 transition-transform group-hover:scale-110"
          //     />
          //   </CardContent>
          //   <CardFooter className="flex flex-col items-start">
          //     <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
          //     <p className="text-xl font-bold mb-2">
          //       ${product.price.toFixed(2)}
          //     </p>
          //     <Link href={`/product/${product.id}`}>
          //       <Button className="w-full">View Details</Button>
          //     </Link>
          //   </CardFooter>
          // </Card>
        ))}
      </div>
    </section>
  );
}
