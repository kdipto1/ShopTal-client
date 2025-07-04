"use client";

import { OrderList } from "@/components/dashboard-page-components/orders-page-components/OrderList";

export default function OrdersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
      </div>
      <OrderList />
    </div>
  );
}