"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Card } from "@/components/shadcn-ui/card";
import { Button } from "@/components/shadcn-ui/button";
import { Input } from "@/components/shadcn-ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { forgotPasswordAPI } from "@/lib/api";

const forgotPasswordSchema = z
  .object({
    email: z.string().email("Enter a valid email").optional().or(z.literal("")),
    phone: z
      .string()
      .regex(/^[0-9-]+$/, "Phone number must contain only digits")
      .optional()
      .or(z.literal("")),
  })
  .refine(data => data.email || data.phone, {
    message: "Provide your email or phone number",
  });

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData, any, ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await forgotPasswordAPI({
        email: data.email || undefined,
        phone: data.phone || undefined,
      });
      setIsSubmitted(true);
      toast.success("If the account exists, a reset link has been sent.");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex justify-center items-center bg-white dark:bg-gray-950">
      <div className="max-w-md w-full">
        <Card className="mx-auto p-5 border border-gray-100 dark:border-gray-800 shadow-none rounded-xl bg-white dark:bg-gray-950">
          <div className="grid gap-1 text-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              Forgot Password
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Enter your email or phone number and we will send you a reset
              link
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                If an account exists with those details, a reset link is on its
                way. Check your inbox.
              </p>
              <Button
                className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
                onClick={() => router.push("/login")}
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          disabled={isLoading}
                          className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <div className="text-xs text-center text-gray-400">or</div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="123-456-7890"
                          {...field}
                          disabled={isLoading}
                          className="rounded-md border border-gray-200 dark:border-gray-800 text-sm placeholder:opacity-50"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-md shadow-none border border-pink-100 hover:border-pink-400 text-sm py-2 transition-colors duration-150"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          )}

          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
            Remembered your password?
            <Link
              className="text-pink-600 hover:underline ml-1"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
