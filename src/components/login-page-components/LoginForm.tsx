"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

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
import { Switch } from "../shadcn-ui/switch";

// Form validation schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(10, "Phone number must not exceed 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const formatPhoneNumber = (phone: string): string => {
    // Assuming the backend expects the format xxx-xxx-xxxx
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: formatPhoneNumber(data.phone),
        password: data.password,
        redirect: false, // We handle redirection manually
      });

      if (result?.error) {
        const errorMessage = "Invalid phone number or password.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success("Login successful");
        router.push("/profile"); // Redirect to a protected page
        router.refresh(); // Refresh the page to update session state
      }
    } catch (err) {
      const errorMessage = "An unexpected error occurred during login.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsAdmin(checked);
    // Pre-fill form with test credentials for convenience
    form.reset({
      phone: checked ? "1234567890" : "9876543210",
      password: checked ? "test@123" : "123456",
    });
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="login-role"
          checked={isAdmin}
          onCheckedChange={handleSwitchChange}
        />
        <label htmlFor="login-role" className="ml-2 text-[#6c63ff]">
          {isAdmin ? "Admin" : "Customer"}
        </label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
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
                  <Input
                    type="password"
                    placeholder="••••••"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
}
