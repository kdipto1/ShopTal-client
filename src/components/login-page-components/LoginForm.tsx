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
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 2 characters.",
  }),
});

const LoginForm = () => {
  // const [token, setToken, removeToken] = useToken("accessToken");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const phone = `${values.phone.slice(0, 3)}-${values.phone.slice(
      3,
      6
    )}-${values.phone.slice(6, 10)}`;
    const password = values.password;
    const response = await fetch(
      `https://shoptal-server.vercel.app/api/v1/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      }
    );
    const data = await response.json();

    if (data) {
      localStorage.setItem("accessToken", data?.data?.accessToken);
    }
    toast(data.message, { duration: 960 });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="1234567890" {...field} />
              </FormControl>
              {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LoginForm;
