import Image from "next/image";
import { notFound } from "next/navigation";
import { Star, ShoppingCart } from "lucide-react";
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
  Key,
} from "react";
import { Button } from "@/components/shadcn-ui/button";
import { Card, CardContent } from "@/components/shadcn-ui/card";
import { Badge } from "@/components/shadcn-ui/badge";

async function getProduct(id: string) {
  const res = await fetch(
    `https://shoptal-server.vercel.app/api/v1/products/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  return res.json();
}

export default async function ProductDetails({
  params,
}: {
  params: { id: string };
}) {
  const { data: product } = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (4.5 out of 5 stars)
            </span>
          </div>
          <p className="text-2xl font-bold">
            ${(product.price / 100).toFixed(2)}
          </p>
          <p className="text-muted-foreground">In stock: {product.quantity}</p>
          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1">
                {product.features.map(
                  (
                    feature: {
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                      value:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<AwaitedReactNode>
                        | null
                        | undefined;
                    },
                    index: Key | null | undefined
                  ) => (
                    <li key={index}>
                      <span className="font-medium">{feature.name}:</span>{" "}
                      {feature.value}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
          <div>
            <h3 className="font-semibold mb-2">Product Details:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p>
                Brand: <Badge variant="outline">{product?.brand?.name}</Badge>
              </p>
              <p>
                Category: <Badge variant="outline">{product.categoryId}</Badge>
              </p>
              <p>
                Subcategory:{" "}
                <Badge variant="outline">{product.subcategoryId}</Badge>
              </p>
              <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
