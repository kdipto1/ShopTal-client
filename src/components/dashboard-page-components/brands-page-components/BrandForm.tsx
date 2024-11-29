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
  name: z.string().min(2, {
    message: "Brand name must be at least 2 characters.",
  }),
  categoryId: z
    .string()
    .uuid({ message: "Select UUID of a category" })
    .optional(),
});

const BrandForm = ({ brandId }: { brandId?: string }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!brandId);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch categories
  const fetchCategories = async () => {
    const data = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
    });
    const categories = await data.json();
    setCategories(categories?.data?.data);
  };

  // Fetch brand data if in edit mode
  const fetchBrand = async () => {
    if (!brandId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/brands/${brandId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch brand data");
      }

      const brandData = await response.json();
      form.reset({
        name: brandData.data.name,
        categoryId: brandData.data.categoryId || "",
      });
    } catch (error) {
      console.error("Error fetching brand:", error);
      toast("Failed to fetch brand data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (brandId) fetchBrand();
  }, [brandId]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const url = brandId
        ? `${API_BASE_URL}/brands/${brandId}`
        : `${API_BASE_URL}/brands`;
      const method = brandId ? "PATCH" : "POST";

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
              <Select
                onValueChange={field.onChange}
                value={field.value} // Bind current value
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category: { name: string; id: string }) => (
                    <SelectItem key={category?.id} value={category?.id}>
                      {category?.name}
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
              <FormLabel>Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{brandId ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
};

export default BrandForm;
