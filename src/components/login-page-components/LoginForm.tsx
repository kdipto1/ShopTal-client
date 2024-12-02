"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PROTECTED_ROUTES } from "@/middleware";
import { setCookie } from "@/lib/cookies";
import { toast } from "sonner";
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
import { setCookie as setCookieNext } from "cookies-next/client";

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
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isAdmin, setIsAdmin] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const formatPhoneNumber = (phone: string): string => {
    return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const checkRouteAccess = (route: string, userRole: string): boolean => {
    const matchingRoute = Object.entries(PROTECTED_ROUTES).find(([path]) =>
      route.startsWith(path)
    );
    return matchingRoute ? matchingRoute[1].includes(userRole) : true;
  };

  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formatPhoneNumber(values.phone),
            password: values.password,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Store auth data
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("userRole", data.data.role);
        setCookieNext("accessToken", data.data.accessToken);
        setCookieNext("userRole", data.data.role);

        // Set cookies and handle redirect
        await setCookie(data.data, {
          redirect: checkRouteAccess(callbackUrl, data.data.role)
            ? callbackUrl
            : "/",
        });

        toast.success("Login successful");
      } else {
        setError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = "An error occurred during login";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsAdmin(checked);
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
        <label htmlFor="login-role" className="ml-2">
          {isAdmin ? "Admin" : "Customer"}
        </label>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-6">
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

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>
    </>
  );
}
