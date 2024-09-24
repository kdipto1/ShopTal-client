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
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
  brandName: z
    .string()
    .min(2, { message: "Product brand name must be at least 2 characters." }),
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

const CreateProductForm = () => {
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
      quantity: 0,
      brandName: "",
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
      setPreview(URL.createObjectURL(file));
      form.setValue("file", file);
    }
  };

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`http://localhost:5000/api/v1/categories`);
    const data = await res.json();
    setCategories(data.data.data);
  }, []);

  const fetchSubcategories = useCallback(async (categoryId: string) => {
    const res = await fetch(
      `http://localhost:5000/api/v1/subcategories?categoryId=${categoryId}`
    );
    const data = await res.json();
    setSubcategories(data.data.data);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const categoryId = form.getValues("categoryId");
    if (categoryId) fetchSubcategories(categoryId);
  }, [form.watch("categoryId"), fetchSubcategories]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price.toString()); // Keep as a number
    formData.append("quantity", data.quantity.toString()); // Keep as a number
    formData.append("brandName", data.brandName);
    formData.append("categoryId", data.categoryId);
    formData.append("subcategoryId", data.subcategoryId);

    if (data.file) {
      formData.append("file", data.file);
    }

    formData.append("features", JSON.stringify(data.features));

    const response = await fetch("http://localhost:5000/api/v1/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    });

    const responseData = await response.json();
    toast(responseData.message, { duration: 960 });
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
          name="brandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Brand Name</FormLabel>
              <FormControl>
                <Input placeholder="Brand name" type="text" {...field} />
              </FormControl>
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
