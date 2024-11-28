"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shadcn-ui/avatar";
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
import useDebounce from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
// Install lodash.debounce

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Product name must be at least 2 characters." }),
  price: z.coerce
    .number()
    .min(1, { message: "Product price must be provided." }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Product quantity must be provided." }),
  brandId: z.string({ message: "Brand for product must be selected" }),
  categoryId: z.string({ message: "Category for product must be selected" }),
  subcategoryId: z.string({
    message: "Subcategory for product must be selected.",
  }),
  file: z.any({ message: "Image file must be selected" }),
  features: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Feature name must be provided." }),
        value: z
          .string()
          .min(1, { message: "Feature value must be provided." }),
      })
    )
    .nonempty({ message: "At least one feature is required." }),
});

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

const CreateProductForm = () => {
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      brandId: "",
      categoryId: "",
      subcategoryId: "",
      file: "",
      features: [{ name: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast("Please select a valid image file.", { duration: 960 });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast("File size must not exceed 5MB.", { duration: 960 });
        return;
      }
      setPreview(URL.createObjectURL(file));
      form.setValue("file", file);
    }
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      setCategories(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  const fetchSubcategories = useCallback(
    useDebounce(async (categoryId: string) => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/subcategories?categoryId=${categoryId}`
        );
        const data = await res.json();
        setSubcategories(data?.data?.data || []);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [API_BASE_URL]
  );

  const fetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/brands`);
      const data = await res.json();
      setBrands(data?.data?.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, [fetchBrands, fetchCategories]);

  useEffect(() => {
    const categoryId = form.getValues("categoryId");
    if (categoryId) {
      setSubcategories([]);
      fetchSubcategories(categoryId);
    }
  }, [form.watch("categoryId"), fetchSubcategories]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "features") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "file" && value) {
          formData.append(key, value);
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to create product.");
      }

      const responseData = await response.json();
      toast(responseData.message, { duration: 960 });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("An error occurred. Please try again.", { duration: 960 });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Price</FormLabel>
              <FormControl>
                <Input placeholder="Product price" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="Product quantity"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Brand</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand: { name: string; id: string }) => (
                    <SelectItem key={brand?.id} value={brand?.id}>
                      {brand?.name}
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
          name="subcategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subcategories.map(
                    (subcategory: { name: string; id: string }) => (
                      <SelectItem key={subcategory?.id} value={subcategory?.id}>
                        {subcategory?.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <Input type="file" onChange={handleFileChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Avatar className="w-36 h-36">
          <AvatarImage className="rounded-md" src={preview} />
          <AvatarFallback className="rounded-md">Image Preview</AvatarFallback>
        </Avatar>

        <div>
          <h2>Features:</h2>
          {fields.map((item, index) => (
            <div key={item.id} className="flex space-x-4  items-center">
              <FormField
                control={form.control}
                name={`features.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`features.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feature Value</FormLabel>
                    <FormControl>
                      <Input placeholder="Feature value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
          ))}
          <Button type="button" onClick={() => append({ name: "", value: "" })}>
            Add Feature
          </Button>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateProductForm;
