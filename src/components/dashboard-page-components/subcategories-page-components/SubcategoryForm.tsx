"use client";

import { Button } from "@/components/shadcn-ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  categoryId: z.string().min(2, {
    message: "Select a valid category.",
  }),
  name: z.string().min(2, {
    message: "Subcategory name must be at least 2 characters.",
  }),
});

export default function SubcategoryForm({
  subcategoryId,
}: {
  subcategoryId?: string;
}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!subcategoryId);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryId: "",
      name: "",
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = async () => {
    try {
      const data = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
      });
      const categories = await data.json();
      setCategories(categories?.data?.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast("Failed to fetch categories.");
    }
  };

  const fetchSubcategory = async () => {
    if (!subcategoryId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/subcategories/${subcategoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") || ""
            }`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subcategory data");
      }

      const subcategoryData = await response.json();
      form.reset({
        categoryId: subcategoryData.data.categoryId,
        name: subcategoryData.data.name,
      });
    } catch (error: any) {
      console.error("Error fetching subcategory:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (subcategoryId) fetchSubcategory();
  }, [subcategoryId]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const url = subcategoryId
        ? `${API_BASE_URL}/subcategories/${subcategoryId}`
        : `${API_BASE_URL}/subcategories`;
      const method = subcategoryId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to process request");
      }

      const responseData = await response.json();
      toast(responseData.message, { duration: 960 });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("An error occurred. Please try again.", { duration: 960 });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: { name: string; id: string }) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder="Subcategory name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{subcategoryId ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}
