"use client";

import { CouponForm } from "@/components/dashboard-page-components/coupons-page-components/CouponForm";
import { createCoupon } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function NewCouponPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!session?.user?.accessToken) {
      toast.error("You must be logged in to create a coupon.");
      return;
    }
    setIsLoading(true);
    try {
      await createCoupon(
        {
          ...data,
          expirationDate: new Date(data.expirationDate).toISOString(),
          discountValue: Number(data.discountValue),
          usageLimit: Number(data.usageLimit),
        },
        session.user.accessToken
      );
      toast.success("Coupon created successfully!");
      router.push("/dashboard/coupons");
    } catch (error: any) {
      toast.error(error.message || "Failed to create coupon.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create New Coupon</h2>
      </div>
      <CouponForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
