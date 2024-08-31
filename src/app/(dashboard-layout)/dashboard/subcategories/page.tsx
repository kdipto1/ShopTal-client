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

const columnDefs = [
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
  const [data, setData] = useState();
  useEffect(() => {
    const getSubcategories = async () => {
      const data = await fetch("http://localhost:5000/api/v1/subcategories");
      const subcategories = await data.json();
      setData(subcategories);
    };
    getSubcategories();
  }, []);

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
    </ContentLayout>
  );
};

export default SubcategoriesPage;
