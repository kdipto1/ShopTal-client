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
  <div className="relative aspect-square w-full">
    <Image
      src={src}
      alt={alt}
      width={600}
      height={600}
      className="rounded-lg"
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
            i < Math.floor(rating) ? "fill-black" : "fill-gray-200"
          }`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500">({rating} out of 5 stars)</span>
  </div>
);

// const FeaturesList = ({ product }: { product: Product }) => (
//   <div className="bg-white rounded-lg border p-4">
//     <h3 className="font-semibold mb-2">Features:</h3>
//     {/* <ul className="list-disc list-inside space-y-1">
//       {features.map((feature, index) => (
//         <li key={index}>
//           <span className="font-medium">{feature.name}:</span> {feature.value}
//         </li>
//       ))}
//     </ul> */}
//     <pre className=" mt-2">{product.description}</pre>
//   </div>
// );

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
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

    return (
      <div className="container mx-auto px-4 py-8 ">
        <div className="grid md:grid-cols-2 gap-8 mb-4 md:mb-0">
          <ProductImage src={product?.image} alt={product?.name} />

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{product?.name}</h1>
            <StarRating />
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-gray-500">In stock: {product.quantity}</p>

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
