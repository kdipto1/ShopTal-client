"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { Order, OrderItem } from "@/types";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { getOrders, updateOrderStatus } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { Separator } from "@/components/shadcn-ui/separator";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailsProps {
  orderId: string;
}

export function OrderDetails({ orderId }: OrderDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const fetchOrder = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setIsLoading(true);
    try {
      // Assuming getOrders can fetch a single order by ID or filter
      // For simplicity, I'm re-using getOrders and filtering on client-side
      // In a real app, you'd have a specific getOrderById API
      const res: any = await getOrders(session.user.accessToken);
      const foundOrder = res.data.find((o: Order) => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
        setSelectedStatus(foundOrder.status);
      } else {
        toast.error("Order not found.");
        router.push("/dashboard/orders");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch order details.");
      router.push("/dashboard/orders");
    } finally {
      setIsLoading(false);
    }
  }, [orderId, session?.user?.accessToken, router]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchOrder();
    }
  }, [orderId, session, fetchOrder]);

  const handleStatusChange = async () => {
    if (!session?.user?.accessToken || !order || !selectedStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(
        order.id,
        selectedStatus,
        session.user.accessToken
      );
      toast.success("Order status updated successfully!");
      setOrder((prev) =>
        prev ? { ...prev, status: selectedStatus as Order["status"] } : null
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Order details not found.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="border border-pink-100 shadow-none rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Order #{order.id}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Placed on {format(new Date(order.createdAt), "PPP p")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Shipping Address:</strong> {order.shippingAddress}
                </p>
                <p>
                  <strong>User ID:</strong> {order.userId}
                </p>
              </div>
              <div>
                <p>
                  <strong>Current Status:</strong> {order.status}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Select
                    onValueChange={setSelectedStatus}
                    value={selectedStatus}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELED">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleStatusChange}
                    disabled={
                      isUpdatingStatus || selectedStatus === order.status
                    }
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Update
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item: OrderItem) => (
                <Card
                  key={item.id}
                  className="border border-gray-100 shadow-none"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <Link
                      href={`/product/${item.productId}`}
                      className="relative w-20 h-20 block flex-shrink-0"
                    >
                      <Image
                        src={item?.product?.image || "/placeholder.svg"}
                        alt={item?.product?.name || "Product Image"}
                        fill
                        className="rounded object-cover"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/product/${item?.productId}`}>
                        <h4 className="font-medium text-base hover:underline">
                          {item?.product?.name || "Unknown Product"}
                        </h4>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold">
                        Price: ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
