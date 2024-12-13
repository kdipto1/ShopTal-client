import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "../shadcn-ui/card";
import { Button } from "../shadcn-ui/button";

type Category = {
  id: string;
  name: string;
  image: string;
};

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories?limit=8&sortBy=createdAt&sortOrder=desc`,
    { next: { revalidate: 60 } }
    // { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.data.data;
}

export default async function Categories() {
  const categories = await fetchCategories();

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/search?categoryId=${category.id}`}
            className="group"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[200px]">
                  <Image
                    src={"/classification.png"}
                    alt={category.name}
                    sizes="(min-width: 100px) 10vw, 20vw"
                    fill
                    className="object-contain transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
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
  );
}
