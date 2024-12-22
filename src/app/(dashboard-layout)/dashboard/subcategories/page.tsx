"use client";

import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import { DataTable } from "@/components/dashboard-page-components/data-table";
import { DataTableColumnHeader } from "@/components/dashboard-page-components/DataTableColumnHeader";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/shadcn-ui/breadcrumb";
import { Button } from "@/components/shadcn-ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updateAt: Date;
};

export default function SubcategoriesPage() {
  const [data, setData] = useState<Subcategory[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const columns: ColumnDef<Subcategory>[] = [
    {
      accessorKey: "id",
      // header: "ID",
      header: ({ column }) => (
        <DataTableColumnHeader className="ml-2" column={column} title="ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "name",
      // header: "Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "categoryId",
      // header: "Category ID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category ID" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("categoryId")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      // header: "CreatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CreatedAt" />
      ),
      cell: ({ row }) => {
        const date: Date = row.getValue("createdAt");
        return <div>{new Date(date).toLocaleString()}</div>;
      },
    },
    {
      accessorKey: "updatedAt",
      // header: "UpdatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UpdatedAt" />
      ),
      cell: ({ row }) => {
        const date: Date = row.getValue("updatedAt");
        return <div>{new Date(date).toLocaleString()}</div>;
      },
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        const subcategory = row.original;
        const handleDelete = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(
              `${API_BASE_URL}/subcategories/${subcategory.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${
                    localStorage.getItem("accessToken") || ""
                  }`,
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to delete subcategory");
            }

            // Refresh the data after successful deletion
            fetchData({
              pageIndex: 0, // Reset to first page
              pageSize: 10, // Default page size, adjust as needed
              searchTerm: "",
              sorting: [],
            });

            // Optional: Add a toast or notification for successful deletion
            toast.success(
              `Subcategory "${subcategory.name}" has been deleted successfully`
            );
          } catch (error) {
            console.error("Error deleting subcategory:", error);
            toast.error("Failed to delete the subcategory");
          } finally {
            setIsLoading(false);
          }
        };
        return (
          <div className="">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/dashboard/subcategories/edit/${subcategory.id}`}>
                Edit
                <ChevronRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"default"}
                  size={"sm"}
                  className={"bg-red-500"}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete subcategory:{" "}
                    {subcategory.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-red-500">
                    Warning: If this subcategory is associated with any product,
                    It will not be deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isLoading ? "Deleting..." : "Confirm"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const fetchData = useCallback(
    async ({
      pageIndex,
      pageSize,
      searchTerm,
      sorting,
    }: {
      pageIndex: number;
      pageSize: number;
      searchTerm: string;
      sorting: any;
    }) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/subcategories?page=${
            pageIndex + 1
          }&limit=${pageSize}&searchTerm=${searchTerm}&sort=${JSON.stringify(
            sorting
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }

        const result = await response.json();
        const totalItems = result.data.meta.total;
        const itemsPerPage = result.data.meta.limit;
        const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

        setData(result.data.data);
        setTotalPages(calculatedTotalPages);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );
  return (
    <ContentLayout title="Subcategories">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Subcategories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/subcategories/new">
        <Button>Add New Subcategory</Button>
      </Link>

      <div className="mt-2">
        <DataTable
          columns={columns}
          data={data}
          fetchData={fetchData}
          totalPages={totalPages}
          isLoading={isLoading}
        />
      </div>
    </ContentLayout>
  );
}
