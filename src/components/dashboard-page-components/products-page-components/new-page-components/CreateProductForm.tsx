// "use client";

// import { Button } from "@/components/shadcn-ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/shadcn-ui/form";
// import { Input } from "@/components/shadcn-ui/input";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// const FormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Product name must be at least 2 characters.",
//   }),
//   price: z.string({
//     message: "Product price should be positive value",
//   }),
//   quantity: z.string({
//     message: "Product quantity should be positive value.",
//   }),
//   brandName: z.string().min(2, {
//     message: "Product brand name must be at least 2 characters.",
//   }),
//   categoryId: z.string({
//     message: "Category for product must be selected",
//   }),
//   subcategoryId: z.string({
//     message: "Subcategory for product must be selected.",
//   }),
//   file: z.string({
//     message: "Image file must be selected",
//   }),
//   features: z.array(
//     z.object({
//       name: z.string(),
//       value: z.string(),
//     })
//   ),
// });

// const CreateProductForm = () => {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: "",
//     },
//   });
//   const [fields, setFields] = useState([{ name: "", value: "" }]);

//   const addField = () => {
//     setFields([...fields, { name: "", value: "" }]);
//   };

//   const deleteField = (index: number) => {
//     setFields(fields.filter((_, i) => i !== index));
//   };

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     console.log("Form submitted:", data);
//     console.log("Form schema:", FormSchema);
//     console.log("Form data:", data);
//     // toast.success("");
//   }
//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="product name" {...field} />
//               </FormControl>
//               {/* <FormDescription>
//                 This is your public display name.
//               </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="price"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Price</FormLabel>
//               <FormControl>
//                 <Input placeholder="product price" type="number" {...field} />
//               </FormControl>
//               {/* <FormDescription>
//                 This is your public display name.
//               </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="quantity"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Quantity</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="product quantity"
//                   type="number"
//                   {...field}
//                 />
//               </FormControl>
//               {/* <FormDescription>
//                 This is your public display name.
//               </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="brandName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Product Brand Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="brand name" type="text" {...field} />
//               </FormControl>
//               {/* <FormDescription>
//                 This is your public display name.
//               </FormDescription> */}
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <div>
//           <h2>Features:</h2>
//           {fields.map((field, index) => (
//             <div key={index} className="flex">
//               <FormItem>
//                 <FormLabel>Feature Name</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="feature name"
//                     type="text"
//                     {...form.register(`features.${index}.name`)}
//                   />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>Feature Value</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder="feature value"
//                     type="text"
//                     {...form.register(`features.${index}.value`)}
//                   />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <Button type="button" onClick={() => deleteField(index)}>
//                   Delete
//                 </Button>
//               </FormItem>
//             </div>
//           ))}
//           <FormItem>
//             <Button type="button" onClick={addField}>
//               Add new feature
//             </Button>
//           </FormItem>
//         </div>
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// };

// export default CreateProductForm;

// ********************************-------------------

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
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted:", data);
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

        <Avatar className="w-36 h-36">
          <AvatarImage className="rounded-md" src={preview} />
          <AvatarFallback>BU</AvatarFallback>
        </Avatar>

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
