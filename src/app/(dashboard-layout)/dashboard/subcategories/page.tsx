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
import Link from "next/link";
import { useEffect, useState } from "react";

const columns = [
  {
    Header: "ID",
    accessor: "id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Created At",
    accessor: "createdAt",
  },
  {
    Header: "Updated At",
    accessor: "updatedAt",
  },
  {
    Header: "Category ID",
    accessor: "categoryId",
  },
];

const SubcategoriesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/subcategories?page=${
            pageIndex + 1
          }&limit=${pageSize}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error status: ${response.status}`);
        }
        const result = await response.json();
        setData(result.data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [pageIndex, pageSize]);

  const onPageChange = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const onPageSizeChange = (pageSize: number) => {
    setPageSize(pageSize);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ContentLayout title="Subcategories">
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
            <BreadcrumbPage>Subcategories</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* <PlaceholderContent /> */}
      <Link href="/dashboard/subcategories/new">
        <Button>Add New Subcategory</Button>
      </Link>

      {/* <DataTable columns={columnDefs} data={data} /> */}
      <DataTable
        columns={columns}
        data={data}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </ContentLayout>
  );
};

export default SubcategoriesPage;
