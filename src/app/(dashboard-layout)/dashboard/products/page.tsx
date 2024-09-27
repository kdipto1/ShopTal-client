"use client";
import ContentLayout from "@/components/dashboard-page-components/ContentLayout";
import { DataTable } from "@/components/dashboard-page-components/data-table";
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
import Link from "next/link";
import React, { useState } from "react";

export type Product = {
  name: string;
  price: number;
  quantity: number;
};

const ProductsPage = () => {
  // const [data, setData] = useState<Payment[]>([]);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      sortingFn: "alphanumeric",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        return <div>${price.toFixed(2)}</div>;
      },
      sortingFn: "basic",
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
      sortingFn: "basic",
    },
  ];

  const fetchData = async ({
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
    console.log(pageIndex, pageSize, searchTerm);
    setLoading(true);

    // Simulate API call with pagination, sorting, and search
    const response = await fetch(
      `http://localhost:5000/api/v1/products?page=${pageIndex}&limit=${pageSize}&searchTerm=${searchTerm}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    console.log(result);
    const totalItems = result.data.meta.total;
    const itemsPerPage = result.data.meta.limit;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    setData(result.data.data);
    setTotalPages(totalPages);
    setLoading(false);
  };
  return (
    <ContentLayout title="Products">
      <Breadcrumb>
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
            <BreadcrumbPage>Products</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/products/new">
        <Button>Add New Product</Button>
      </Link>

      <div>
        <DataTable
          columns={columns}
          data={data}
          fetchData={fetchData}
          totalPages={totalPages}
        />
        {loading && <p>Loading...</p>}
      </div>
    </ContentLayout>
  );
};

export default ProductsPage;
