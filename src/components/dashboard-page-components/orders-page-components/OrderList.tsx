"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import { DataTable } from "@/components/dashboard-page-components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types";
import { format } from "date-fns";
import { Loader2, Eye } from "lucide-react";
import { getOrders } from "@/lib/api";
import Link from "next/link";

export function OrderList() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setIsLoading(true);
    try {
      const res: any = await getOrders(session.user.accessToken);
      setOrders(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchOrders();
    }
  }, [session, fetchOrders]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => `$${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: "shippingAddress",
      header: "Shipping Address",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Order Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return format(date, "PPP");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <Link href={`/dashboard/orders/${order.id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" /> View Details
            </Button>
          </Link>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={orders}
        fetchData={async () => {}}
        totalPages={1}
        isLoading={isLoading}
      />
    </div>
  );
}
