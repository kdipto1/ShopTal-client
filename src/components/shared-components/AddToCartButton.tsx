"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../shadcn-ui/button";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  productId: string;
  initialQuantity?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const AddToCartButton = ({
  productId,
  initialQuantity = 1,
}: AddToCartButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(initialQuantity);
  const router = useRouter();

  const addToCart = async () => {
    if (localStorage.getItem("accessToken") === null) {
      toast.info("Login to add product to cart", {
        closeButton: true,
        position: "top-right",
        richColors: true,
      });
      router.push(`/login?callbackUrl=%2Fproduct/${productId}`);
      return;
    }
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }

      const data = await response.json();

      if (data.success) {
        toast(data.message);
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-md border border-gray-300 px-2 py-1"
          disabled={isLoading}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* <button
        onClick={addToCart}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </button> */}
      <Button
        onClick={addToCart}
        disabled={isLoading}
        // className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
};
