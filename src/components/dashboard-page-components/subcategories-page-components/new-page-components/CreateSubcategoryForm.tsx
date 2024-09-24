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
    message: "Category name must be at least 2 characters.",
  }),
  categoryId: z.string().min(2, {
    message: "Subcategory name must be at least 2 characters.",
  }),
});

const CreateSubcategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      categoryId: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    toast.success("");
  };

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetch(
        // "https://shoptal-server.vercel.app/api/v1/categories",
        `http://localhost:5000/api/v1/categories`,
        {
          method: "GET",
        }
      );
      const categories = await data.json();
      setCategories(categories.data.data);
    };
    getCategories();
  }, []);
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
              <FormLabel>Subcategory Name</FormLabel>
              <FormControl>
                <Input placeholder="subcategory" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default CreateSubcategoryForm;
