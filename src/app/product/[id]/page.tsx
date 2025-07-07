import { AddToCartButton } from "@/components/shared-components/AddToCartButton";
import { fetchAPI, getMyOrders } from "@/lib/api";
import { Order, Product } from "@/types";
import Image from "next/image";
import { Star } from "lucide-react";
import { FeaturesList } from "@/components/product-page-components/FeaturesList";
import { ProductReviews } from "@/components/product-page-components/ProductReviews";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { auth } from "@/auth";

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product> {
  const product = await fetchAPI<{ data: Product }>(`/products/${id}`);
  return product.data;
}

async function checkReviewEligibility(productId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.accessToken) {
    return false;
  }

  try {
    const orders = await getMyOrders(session.user.accessToken);
    return orders.some(
      (order: Order) =>
        order.status === "DELIVERED" &&
        order.orderItems.some((item) => item.productId === productId)
    );
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return false;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id);
  const canReview = await checkReviewEligibility(params.id);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/search">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="overflow-hidden border-none shadow-none">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-4">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="rounded-xl object-cover w-full aspect-square"
              />
            </div>

            <div className="flex flex-col justify-center p-4">
              <CardHeader className="p-0">
                <CardTitle className="text-4xl font-bold tracking-tight mb-4">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.averageRating)
                            ? "text-primary"
                            : "text-muted-foreground/30"
                        }`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {product?.averageRating.toFixed(1)} (
                    {product?.reviews?.length} reviews)
                  </p>
                </div>
                <p className="text-4xl font-extrabold mb-6">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>

                <FeaturesList features={product.features} />
              </CardContent>
              <CardFooter className="p-0 mt-8">
                <AddToCartButton productId={product.id} />
              </CardFooter>
            </div>
          </div>
        </Card>

        <ProductReviews
          productId={product.id}
          reviews={product.reviews}
          averageRating={product.averageRating}
          canReview={canReview}
        />
      </div>
    </div>
  );
}
