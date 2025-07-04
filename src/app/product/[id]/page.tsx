import { AddToCartButton } from "@/components/shared-components/AddToCartButton";
import { fetchAPI } from "@/lib/api";
import { Product } from "@/types";
import Image from "next/image";
import { Star } from "lucide-react";
import { FeaturesList } from "@/components/product-page-components/FeaturesList";
import { ProductReviews } from "@/components/product-page-components/ProductReviews";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product> {
  const product = await fetchAPI<{ data: Product }>(`/products/${id}`);
  return product.data;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg object-cover w-full"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                />
              ))}
            </div>
            <p className="ml-2 text-sm text-muted-foreground">
              {product?.averageRating.toFixed(1)} ({product?.reviews?.length}{" "}
              reviews)
            </p>
          </div>
          <p className="text-2xl font-semibold mb-4">${product.price}</p>
          {/* @ts-ignore */}
          <p className="text-muted-foreground mb-6">{product.description}</p>

          {/* @ts-ignore */}
          <FeaturesList features={product.features} />

          <AddToCartButton productId={product.id} />
        </div>
      </div>
      <ProductReviews
        productId={product.id}
        reviews={product.reviews}
        averageRating={product.averageRating}
      />
    </div>
  );
}
