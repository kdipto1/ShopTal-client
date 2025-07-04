"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/shadcn-ui/button";
import { DataTable } from "@/components/dashboard-page-components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Coupon } from "@/types";
import { format } from "date-fns";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { deleteCouponAPI, getCouponsAPI } from "@/lib/api";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/shadcn-ui/alert-dialog";

export function CouponList() {
  const { data: session } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setIsLoading(true);
    try {
      const res: any = await getCouponsAPI(session.user.accessToken);
      setCoupons(res.data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch coupons.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.accessToken) {
      fetchCoupons();
    }
  }, [session, fetchCoupons]);

  const handleDelete = async (id: string) => {
    if (!session?.user?.accessToken) return;
    setIsDeleting(id);
    try {
      await deleteCouponAPI(id, session.user.accessToken);
      toast.success("Coupon deleted successfully!");
      setCoupons((prev) => prev.filter((coupon) => coupon.id !== id));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon.");
    } finally {
      setIsDeleting(null);
    }
  };

  const columns: ColumnDef<Coupon>[] = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "discountType",
      header: "Type",
    },
    {
      accessorKey: "discountValue",
      header: "Value",
      cell: ({ row }) => {
        const coupon = row.original;
        return coupon.discountType === "PERCENTAGE"
          ? `${coupon.discountValue}%`
          : `$${coupon.discountValue.toFixed(2)}`;
      },
    },
    {
      accessorKey: "usageLimit",
      header: "Usage Limit",
    },
    {
      accessorKey: "used",
      header: "Used",
    },
    {
      accessorKey: "expirationDate",
      header: "Expiration Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("expirationDate"));
        return format(date, "PPP");
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const coupon = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Link href={`/dashboard/coupons/edit/${coupon.id}`}>
              <Button variant="outline" size="sm">
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting === coupon.id}
                >
                  {isDeleting === coupon.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the coupon.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(coupon.id)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
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
      <div className="flex justify-end mb-4">
        <Link href="/dashboard/coupons/new">
          <Button>Create New Coupon</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={coupons}
        fetchData={async () => {}}
        totalPages={1}
        isLoading={isLoading}
      />
    </div>
  );
}
