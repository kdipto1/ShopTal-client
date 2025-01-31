"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn-ui/form";
import { Input } from "../shadcn-ui/input";
import { Button } from "../shadcn-ui/button";
import { toast } from "sonner";

const formSchema = z.object({
  phone: z.string().min(10, {
    message: "10 digit phone number required",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 2 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  address: z.string({
    message: "Address is required",
  }),
});

export default function SignupForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      password: "",
    },
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const phone = `${values.phone.slice(0, 3)}-${values.phone.slice(
      3,
      6
    )}-${values.phone.slice(6, 10)}`;
    const password = values.password;
    const firstName = values.firstName;
    const lastName = values.lastName;
    const email = values.email;
    const address = values.address;
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          address,
          password,
        }),
      });

      if (response.ok) form.reset();

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to process request");
      }

      const responseData = await response.json();
      toast.info(responseData.message + " " + "Now you can login!", {
        duration: 4000,
      });
      // toast.info("Now you can login", { duration: 960 });
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message, { duration: 960 });
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-60">
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-52">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-52">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="johndoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-52">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="1234567890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-52">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input type="text" placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="min-w-40 md:min-w-52">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
