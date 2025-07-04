"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getOrders } from "@/lib/api";
import { Order } from "@/types";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Badge } from "@/components/shadcn-ui/badge";
import Image from "next/image";

export default function UserOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (session?.user?.accessToken) {
        try {
          setLoading(true);
          const res = (await getOrders(session.user.accessToken)) as {
            data: Order[];
          };

          setOrders(res.data);
        } catch (error) {
          console.error("Failed to fetch orders", error);
          toast.error("Failed to fetch your orders.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserOrders();
  }, [session]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {loading ? (
        <p>Loading your orders...</p>
      ) : orders?.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Order ID: {order.id}</span>
                  <Badge>{order.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Shipping Address:</strong> {order.shippingAddress}
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold">Items:</h4>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-2 mb-2"
                      >
                        {item.product?.image && (
                          <Image
                            src={item.product.image}
                            alt={item.product?.name || "Product"}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded border"
                          />
                        )}
                        <span className="font-medium">
                          {item.product?.name || item.productId}
                        </span>
                        <span className="ml-2">
                          x {item.quantity} @ ${item.price.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
