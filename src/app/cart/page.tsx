"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Skeleton } from "@/components/shadcn-ui/skeleton";
import { Button } from "@/components/shadcn-ui/button";
import Image from "next/image";

interface CartItem {
  id: string;
  quantity: number;
  cartId: string;
  productId: string;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: CartItem[];
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/user-items`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }
      const data: ApiResponse = await response.json();
      setCartItems(data.data);
    } catch (error) {
      setError("Failed to fetch cart items");
      toast.error("Could not load your cart items. Please try again later.");
      console.error("Error fetching cart items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast.error("Cart quantity updated successfully");
    } catch (error) {
      toast("Failed to update quantity. Please try again.");
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingItems((prev) => new Set(prev).add(itemId));
    try {
      const response = await fetch(`${API_BASE_URL}/cart-items/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      toast("Item removed from cart");
    } catch (error) {
      toast("Failed to remove item. Please try again.");
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-24 h-24 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                fetchCartItems();
              }}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button className="mt-4" variant="outline">
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24">
                      <Image
                        src={item?.product.image}
                        alt={item?.product.name}
                        fill
                        className="rounded-md object-cover"
                        sizes="(max-width: 96px) 100vw, 96px"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <Button
                          onClick={() => removeItem(item.id)}
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={updatingItems.has(item.id)}
                        >
                          {updatingItems.has(item.id) ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={
                              item.quantity <= 1 || updatingItems.has(item.id)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            disabled={updatingItems.has(item.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-medium">
                          $
                          {((item.product.price * item.quantity) / 100).toFixed(
                            2
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(calculateTotal() / 100).toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(calculateTotal() / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  // Add checkout functionality here
                  toast("Proceeding to checkout...");
                }}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
