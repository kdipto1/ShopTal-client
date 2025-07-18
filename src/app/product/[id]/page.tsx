import { FeaturesList } from "@/components/product-page-components/FeaturesList";
import { AddToCartButton } from "@/components/shared-components/AddToCartButton";
import { Star } from "lucide-react";
import Image from "next/image";

// Types
interface Feature {
  name: string;
  value: string | number;
}

interface Brand {
  name: string;
  id: string;
}
interface Category {
  name: string;
  id: string;
}
interface Subcategory {
  name: string;
  id: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  features: Feature[];
  brand?: Brand;
  category?: Category;
  subcategory?: Subcategory;
  categoryId: string;
  subcategoryId: string;
  createdAt: string;
  description: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getProduct(id: string): Promise<{ data: Product }> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

// Subcomponents
const ProductImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-square w-full bg-gradient-to-br from-pink-50 to-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
    <Image
      src={src}
      alt={alt}
      width={600}
      height={600}
      className="rounded-lg object-contain w-full h-full"
    />
  </div>
);

const StarRating = ({ rating = 4 }: { rating?: number }) => (
  <div className="flex items-center space-x-2">
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < Math.floor(rating)
              ? "fill-pink-600 text-pink-600"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">({rating} out of 5 stars)</span>
  </div>
);

const Badge = ({
  children,
  color = "border-pink-200 bg-pink-50 text-pink-600",
}: {
  children: React.ReactNode;
  color?: string;
}) => (
  <span
    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 ${color}`}
  >
    {children}
  </span>
);

const ProductDetails = ({ product }: { product: Product }) => (
  <div>
    <h3 className="font-semibold mb-2">Product Details:</h3>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <p>
        Brand: <Badge>{product?.brand?.name || "N/A"}</Badge>
      </p>
      <p>
        Category: <Badge>{product?.category?.name || "N/A"}</Badge>
      </p>
      <p>
        Subcategory: <Badge>{product?.subcategory?.name || "N/A"}</Badge>
      </p>
      <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
);

// Main Component
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { data: product } = await getProduct(params.id);

    if (!product) {
      return (
        <div className="container mx-auto px-4 py-8 text-center">
          Product not found
        </div>
      );
    }

    // Check if product is new (added within last 14 days)
    const isNew =
      Date.now() - new Date(product.createdAt).getTime() <
      14 * 24 * 60 * 60 * 1000;

    return (
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid md:grid-cols-2 gap-8 mb-4 md:mb-0">
          <div className="relative">
            {isNew && (
              <span className="absolute top-2 left-2 z-10">
                <Badge color="border-pink-600 bg-pink-600 text-white">
                  New
                </Badge>
              </span>
            )}
            <ProductImage src={product?.image} alt={product?.name} />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {product?.name}
              {isNew && (
                <Badge color="border-pink-600 bg-pink-600 text-white">
                  New
                </Badge>
              )}
            </h1>
            <StarRating />
            <p className="text-2xl font-bold text-pink-600">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-500">
              In stock:{" "}
              <span className="font-semibold text-green-600">
                {product.quantity}
              </span>
            </p>

            <AddToCartButton productId={product?.id} />
            <ProductDetails product={product} />
          </div>
        </div>
        <FeaturesList product={product} />
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Error loading product. Please try again later.
      </div>
    );
  }
}
